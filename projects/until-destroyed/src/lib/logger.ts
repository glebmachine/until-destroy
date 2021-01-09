import { ReplaySubject } from 'rxjs';
// TODO: Надо сделать через DI
const environment = { production: false };


export function consoleChalk(name: string, color = 'ff4081') {
  return [
    `%c${name}`,
    `background: #${color}; color: white; padding: 2px 5px; border-radius: 3px`
  ];
}

export function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
     // tslint:disable-next-line:no-bitwise
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  // tslint:disable-next-line:no-bitwise
  const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

const _stream$ = new ReplaySubject<any[]>(200);
const _sentry$ = new ReplaySubject<string[]>(100);

export const Logger = {
  stream$: _stream$.asObservable(),
  sentry$: _sentry$.asObservable(),
  /** Создает логгер, который автоматически присваивает цвет бейджику */

  sentry(id: string, link) {
    _sentry$.next([id, link]);
    console.log(...consoleChalk('sentry', intToRGB(hashCode('sentry'))), link);
  },

  create(
    /** Название бейджика */
    name,
    /** Активен ли логгер,
     * null - только в дев режиме
     * false - никогда
     * true - всегда
     * */
    isEnabled: boolean = null) {

    return function log(...args) {
      const isActive = isEnabled === true || isEnabled === null && !environment.production;
      // Если включена форсом, то отображать логи, если не передан форс, то не показываем
      if (isActive) {
        _stream$.next([isActive, intToRGB(hashCode(name)), name, args.join(' ')]);
        console.log(...consoleChalk(name, intToRGB(hashCode(name))), ...args);
      }
    };
  },
};
