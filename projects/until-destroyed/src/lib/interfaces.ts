import { OnDestroy, Optional } from "@angular/core";
import { Observable } from "rxjs";

/** Single hook callback function. */
export type HookFn = () => void;

/**
 * Information necessary to call a hook. E.g. the callback that
 * needs to invoked and the index at which to find its context.
 */
export type HookEntry = number|HookFn;

/**
 * Array of hooks that should be executed for a view and their directive indices.
 *
 * For each node of the view, the following data is stored:
 * 1) Node index (optional)
 * 2) A series of number/function pairs where:
 *  - even indices are directive indices
 *  - odd indices are hook functions
 *
 * Special cases:
 *  - a negative directive index flags an init hook (ngOnInit, ngAfterContentInit, ngAfterViewInit)
 */
export type HookData = HookEntry[];
export type DestroyHookData = (HookEntry|HookData)[];

export interface PartialTView {
  /**
   * Array of ngOnDestroy hooks that should be executed when this view is destroyed.
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   */
  destroyHooks: DestroyHookData|null;
}

export const LVIEW_TVIEW = 1;
export const LVIEW_FLAGS = 2;

/** Flags associated with an LView (saved in LView[FLAGS]) */
export const enum PartialLViewFlags {
  /** Whether or not this view is currently attached to change detection tree. */
  Attached = 0b000010000000,

  /** Whether or not this view is destroyed. */
  Destroyed = 0b000100000000,
}

export interface PartialLView extends Array<any> {
  /**
   * The static data for this view. We need a reference to this so we can easily walk up the
   * node tree in DI and get the TView.data array associated with a node (where the
   * directive defs are stored).
   */
  readonly[LVIEW_TVIEW]: PartialTView;

  /** Flags for this view. See LViewFlags for more info. */
  [LVIEW_FLAGS]: PartialLViewFlags;
}

export interface AngularEntityProtoype {
  counter?: number;
  constructor: any & { name: string };
  ngOnDestroyOriginal?: HookFn;
  ngOnDestroy?: HookFn;
}

export interface AngularEntityInstance extends Partial<OnDestroy> {
  __ngContext__?: PartialLView;
  // tslint:disable-next-line: ban-types
  constructor?: Function & {
    /* мета о компоненте */
    ɵcmp: any;
    /* мета о директиве */
    ɵdir: any;
    /* мета о пайпе */
    ɵpipe: any
    /* мета о провайдере */
    ɵprov: any
  };
  __proto__?: AngularEntityProtoype;
  /** Функция, которую будет отстукивать ngOnDestroy */
  __onDestroyHook?: HookFn;
  /** сабжект, который реактивщину реализует */
  __onDestroyStream$?: Observable<boolean>;
  /** уникальный порядковый номер текущего инстанса, для дебага */
  __uid?: number;
  /** имя, содержит название класса и номер, для дебага */
  __name?: string;
}
