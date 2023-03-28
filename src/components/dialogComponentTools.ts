import { createApp, Component, ComponentPublicInstance } from 'vue';
import { cloneDeep, isEqual } from 'lodash';
import Deferred from '../utils/deferred';

export type DialogInstance = {
  value: ComponentPublicInstance;
  unmount: () => void;
  isAutoClose: boolean;
};

export const mountComponent = (RootComponent: Component, prop: any) => {
  const app = createApp(RootComponent, prop);
  const root = document.createElement('div');
  document.body.appendChild(root);
  return {
    root,
    value: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
    isAutoClose: true,
  };
};

type getDomFun = ()=>Component

/**
 * @desc useDialogInstance 挂载式组件的内置方法的闭包工具，其实可以理解这是一个类，返回值是实例
 * @type ResolveT 异步组件在resolve时返回的数据类型
 * @type CreatorParamsType creator的入参类型，该入参最终会成为dialogModalDom的props属性
 * @params dialogModalDom 组件主体的vue对象
 * @params defaultResolve 异步组件在resolve时返回的默认值
 */
export const useDialogInstance = <ResolveT, CreatorParamsType>(
  dialogModalDom: Component,
  defaultResolve: ResolveT,
) => {
  let instance: DialogInstance | null = null;
  const getDeferredInstance = <T>() => new Deferred<T>();

  let deferred: ReturnType<typeof getDeferredInstance> | null = null;

  const close = (resolveData = defaultResolve, immediately = false) => {
    console.log('close');
    deferred?.resolve?.(resolveData);
    deferred = null;
    const unmount = instance?.unmount || (() => null);
    instance = null;
    if (immediately) {
      unmount();
    } else {
      setTimeout(() => {
        // 有离场动画
        unmount();
      }, 1 * 1000);
    }
  };

  const popstate = () => {
    close(defaultResolve, true);
    window.removeEventListener('popstate', popstate);
  };

  const creator = <T = ResolveT>(props: CreatorParamsType = {} as CreatorParamsType) => {
    window.addEventListener('popstate', popstate);
    // 这里为了让TS更好的推断类型，所以多做一次赋值
    const tmp = getDeferredInstance<T>();
    deferred = tmp;

    const res = {
      deferred: tmp,
      instance,
    };

    if (typeof dialogModalDom === 'function') {
      const test = dialogModalDom as any;
      console.log('1');
      test().then((dom : any) => {
        console.log('2', dom.default);
        res.instance = mountComponent(dom.default, {
          close,
          ...props,
        });
      });
    } else {
      res.instance = mountComponent(dialogModalDom, {
        close,
        ...props,
      });
    }

    return res;
  };

  return { creator, close };
};

export const changeCheck = (target: any) => {
  const dataBack = cloneDeep(target);
  const haveChange = () => !isEqual(dataBack, cloneDeep(target));
  return haveChange;
};

export default null;
