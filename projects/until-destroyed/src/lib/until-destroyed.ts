import { EMPTY, MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularEntityInstance, HookFn, LVIEW_FLAGS, LVIEW_TVIEW, PartialLViewFlags, PartialTView } from './interfaces';
import { Logger } from './logger';
import { ensureNgOnDestroyPatched, ON_DESTROY_PATCHED } from './utils';

const logMessage = Logger.create('until-destroy');
let count = 0;

const aliveList = window['untilDestroyedAliveList'] = [];
/* Для проверки на активные обработчики
TODO: Надо удалить все отладки, как только станет понятно, что оно работает, не позже февраля!!
```
Object.keys(untilDestroyedStatusMap).forEach(k => {
    if (!untilDestroyedStatusMap[k]) {
        delete untilDestroyedStatusMap[k];
    }
});
```
console.table(untilDestroyedStatusMap);
*/
const statusMap = window['untilDestroyedStatusMap'] = {} as { [key: string]: number};


function getHookIndex(tView: PartialTView, hook: HookFn): number {
  return tView.destroyHooks.indexOf(hook);
}

function isHookExists(tView: PartialTView, hook: HookFn): boolean {
  return getHookIndex(tView, hook) !== -1;
}

function replaceHook(tView: PartialTView, hook: HookFn, newHook: HookFn): boolean {
  if (!isHookExists(tView, hook)) {
    return false;
  }
  tView.destroyHooks[getHookIndex(tView, hook)] = newHook;
  return true;
}

export function untilDestroyed<T>(_instance: any): MonoTypeOperatorFunction<T> {
  const instance = _instance as AngularEntityInstance;
  const instanceLView = instance.__ngContext__;
  const isRuntime = !!instanceLView;

  const isComponent = instance.constructor.ɵcmp;
  const isDirective = instance.constructor.ɵdir;
  const isService = instance.constructor.ɵprov;
  const isPipe = instance.constructor.ɵpipe;
  const isView = isComponent || isDirective;

  if (isPipe) {
    throw new Error('untilDestroyed: пайпы пока что не поддерживаются');
  }

  // Если это сервис и не пропатчен ngOnDestroy
  if (isService && !_instance[ON_DESTROY_PATCHED]) {
    logMessage(`${instance.__proto__.constructor.name} не пропатчен ngOnDestroy`);
    console.error('untilDestroyed() вместе с сервисами можно использовать только в случае если он декорирован UntilDestroy()');
    throw new Error(`Сервис ${instance.__proto__.constructor.name} не декорирован UntilDestroy() декоратором`);
  }

  // Если компонент или директива уже уничтожена, то выходим, нам тут делать нечего
  // tslint:disable-next-line: no-bitwise
  if (isView && isRuntime && (instanceLView[LVIEW_FLAGS] & PartialLViewFlags.Destroyed) === PartialLViewFlags.Destroyed) {
    logMessage(`${instance.__proto__.constructor.name} компонент уже был уничтожен, выходим`);
    console.warn('untilDestroyed() был вызван на уже уничтоженном компоненте! У тебя произошел race condition. Нужно поправить, может привести к непредвиденным результатам');
    return takeUntil(EMPTY);
  }


  // Добавляем счетчик для отладки в прототип
  if (!instance.__proto__.counter) {
    instance.__proto__.counter = 0;
  }

  /* Экстендим инстанс, если он еще не был расширен
   * Cоздаем стрим в экземпляре
   * Cоздаем хук в экземпляре
  */
  if (!instance.__onDestroyStream$) {
    instance.__onDestroyStream$ = new Subject();
    instance.__proto__.counter++;
    instance.__uid = instance.__proto__.counter;
    instance.__name = `${instance.__proto__.constructor.name} ${instance.__uid}`;

    // Тот самый секретный метод, что будет делать реальную работу со стримом
    instance.__onDestroyHook = function(): void {
      this.__onDestroyStream$.next(true);
      this.__onDestroyStream$.complete();

      count--;
      logMessage(`${this.__name} удален, всего`, count);
      aliveList.splice(aliveList.indexOf(this.__name), 1);
      statusMap[instance.__name]--;
    };

    count++;
    logMessage(`${instance.__name} добавлен, всего`, count);
    aliveList.push(instance.__name);
    statusMap[instance.__name] = 1;

    // И последнее, убеждаемся, что наш хук зареган
    if (!isRuntime) {
      /*
       Если мы еще не в забустрапленом компоненте, то
       патчим ему прототип так, чтобы ангуляр подумал, что у него есть ngOnDestroy
       и прописал его в хуки TView самостоятельно.
       Потом при вызове этого хука он по идее прыгнет в имплементацию
       и там отработает уже наш секретный хук
      */
      if (isView) {
        console.warn('Ты используешь untilDestroyed() в контрукторе, не делай так. \r\n\ Я конечно сработаю, но лучше так не делать!');
      }

      ensureNgOnDestroyPatched(instance.__proto__);
    } else {
      /*
       Ну а если мы уже в рантайме, и ангуляр говорит "не будут регистрировать"
       То мы сами сходим в TView (она в контексте всегда вторая по счету)
       И сами подпихнем в массив хуков себя (там хитрая запись, индекс инстанса и потом ссылка на функцию хука)
      */
      const index = instance.__ngContext__.indexOf(instance);
      const tView = instance.__ngContext__[LVIEW_TVIEW];
      const destroyHooks = tView.destroyHooks || (tView.destroyHooks = []);

      // Если у прототипа есть ngOnDestroy, значит он зареган
      if (instance.__proto__.ngOnDestroy) {
        logMessage(`${instance.__name} найден ngOnDestroy в прототипе`);
        if (!instance.__proto__.ngOnDestroyOriginal) {
          logMessage(`${instance.__name} он не обернут, обернули в нашу имплементацию`);
          ensureNgOnDestroyPatched(instance.__proto__);
        }

        // Проверяем, если в хуках лежит оригинальный, то подменяем
        if (isHookExists(tView, instance.__proto__.ngOnDestroyOriginal)) {
          replaceHook(tView, instance.__proto__.ngOnDestroyOriginal, instance.__proto__.ngOnDestroy);
        }
      } else {
        // Почему не вынесено на уровень выше сразу для всех:
        // Чтобы уменьшить количество проверок в блоке выше
        ensureNgOnDestroyPatched(instance.__proto__);
      }

      // Если в перечень кухов нас еще нет, то добавляемся
      if (isHookExists(tView, instance.ngOnDestroy)) {
        logMessage(`${instance.__name} скипнул добавление хука, он уже есть`);
      } else {
        destroyHooks.push(index, instance.ngOnDestroy);
      }
    }
  }

  // Возвращаем оператор со стримом
  return takeUntil<T>(instance.__onDestroyStream$);
}
