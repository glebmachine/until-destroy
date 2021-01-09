import { ensureNgOnDestroyPatched } from './utils';



export function UntilDestroy(): ClassDecorator {
  return (type: any) => {
    // Если не сервис
    if (!type.ɵprov) {
      throw new Error('UntilDestroy(): меня можно использовать только на сервисы, для компонентов и директив untilDestroyed() работает без декоратора');
    }

    ensureNgOnDestroyPatched(type.prototype);
  };
}
