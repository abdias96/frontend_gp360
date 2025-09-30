import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import { useI18n } from 'vue-i18n'

export function useToast() {
  const { t } = useI18n()

  const showToast = (message: string, type: SweetAlertIcon = 'info') => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: type,
      title: message
    })
  }

  const showConfirm = async (
    title: string,
    text?: string,
    confirmButtonText?: string,
    cancelButtonText?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText || t('common.confirm'),
      cancelButtonText: cancelButtonText || t('common.cancel')
    })
  }

  const showWarning = async (
    title: string,
    text?: string,
    confirmButtonText?: string,
    cancelButtonText?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText || t('common.confirm'),
      cancelButtonText: cancelButtonText || t('common.cancel')
    })
  }

  const showSuccess = (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: t('common.ok')
    })
  }

  const showError = (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: t('common.ok')
    })
  }

  const showInfo = (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: t('common.ok')
    })
  }

  const showPrompt = async (
    title: string,
    inputLabel?: string,
    inputPlaceholder?: string,
    inputValue?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      input: 'text',
      inputLabel,
      inputValue,
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      inputValidator: (value) => {
        if (!value) {
          return t('common.field_required')
        }
        return null
      }
    })
  }

  const showTextarea = async (
    title: string,
    inputLabel?: string,
    inputPlaceholder?: string,
    inputValue?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      input: 'textarea',
      inputLabel,
      inputValue,
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      inputValidator: (value) => {
        if (!value) {
          return t('common.field_required')
        }
        return null
      }
    })
  }

  const showLoading = (title?: string, text?: string) => {
    Swal.fire({
      title: title || t('common.loading'),
      text: text || t('common.please_wait'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  const closeLoading = () => {
    Swal.close()
  }

  return {
    showToast,
    showConfirm,
    showWarning,
    showSuccess,
    showError,
    showInfo,
    showPrompt,
    showTextarea,
    showLoading,
    closeLoading
  }
}