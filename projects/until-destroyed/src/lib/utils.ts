import { AngularEntityProtoype } from './interfaces';

export const ON_DESTROY_PATCHED: unique symbol = Symbol('__onDestroyPatched');

export function ensureNgOnDestroyPatched(proto: AngularEntityProtoype): void {

  if (!proto[ON_DESTROY_PATCHED]) {
    proto.ngOnDestroyOriginal = proto.ngOnDestroy || ((): void => {});
    proto.ngOnDestroy = function(): void {
      /**
       * Это кейс, когда этот класс уже имел экземпляр, что вписался на untilDestroyed
       * Но в этот раз он уничтожается до того, как был динамически подписан на уничтожение
       * Поэтому у конкретного экземпляра нету методов (они появляются on-demand, при первой подписке в рантайме)
       */
      if (this.ngOnDestroyOriginal) {
        this.ngOnDestroyOriginal();
      }

      /*
      При повторной отрисовке рендеринге может оказаться, что хук еще не создан
      у текущего инстанса, а мы у него в прототипе
      */
      if (this.__onDestroyHook) {
        this.__onDestroyHook();
      }
    };

    proto[ON_DESTROY_PATCHED] = true;
  }
}
