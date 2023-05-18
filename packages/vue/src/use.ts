import pdfeasy from 'pdfeasy';
import { getCurrentInstance, ComponentInternalInstance } from 'vue-demi';

export const usePDF = (): typeof pdfeasy => {
  const instance = getCurrentInstance();

  if (!instance) {
    console.warn(
      "[VUE-PDFEASY] - Vue instance not exists. Hook is in setup() context?"
    );
  }

  const pdf = (instance as ComponentInternalInstance).appContext
    .config.globalProperties.$pdf

  return pdf
}