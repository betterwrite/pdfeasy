import pdfeasy from 'pdfeasy';
import { getCurrentInstance, ComponentInternalInstance } from 'vue-demi';

export const usePDF = (): typeof pdfeasy => {
  const internalInstance = getCurrentInstance()
  const pdf = (internalInstance as ComponentInternalInstance).appContext
    .config.globalProperties.$pdf

  return pdf
}