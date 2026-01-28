import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import { useI18n } from 'vue-i18n'

/**
 * Composable for SweetAlert2 dialogs with centralized translations
 * Uses translations from common.swal namespace
 *
 * Usage:
 * ```ts
 * const { showSuccess, showError, showConfirmDelete, showLoading } = useSwal()
 *
 * // Simple success
 * showSuccess()
 *
 * // With custom message
 * showSuccess('custom.translation.key')
 *
 * // Confirm delete with item name
 * const result = await showConfirmDelete('usuario')
 * if (result.isConfirmed) { ... }
 * ```
 */
export function useSwal() {
  const { t } = useI18n()

  // Helper to get translation or return the key if it's already translated
  const getText = (key: string, fallback?: string): string => {
    const translation = t(key)
    // If translation returns the same key, it wasn't found, use fallback
    return translation === key ? (fallback || key) : translation
  }

  // ==================== TOAST NOTIFICATIONS ====================

  const showToast = (
    message: string,
    type: SweetAlertIcon = 'info',
    timer: number = 3000
  ) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: type,
      title: getText(message, message)
    })
  }

  // ==================== SUCCESS DIALOGS ====================

  const showSuccess = (
    messageKey?: string,
    titleKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'success',
      title: getText(titleKey || 'common.swal.titles.success'),
      text: messageKey ? getText(messageKey) : getText('common.swal.messages.operationSuccess'),
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showSaveSuccess = (itemName?: string): Promise<SweetAlertResult> => {
    const title = itemName
      ? getText('common.swal.crud.saveSuccessTitle', '{item} guardado').replace('{item}', itemName)
      : getText('common.swal.titles.saved')
    const text = itemName
      ? getText('common.swal.crud.saveSuccessText', 'El {item} ha sido guardado exitosamente.').replace('{item}', itemName)
      : getText('common.swal.messages.saveSuccess')

    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showUpdateSuccess = (itemName?: string): Promise<SweetAlertResult> => {
    const title = itemName
      ? getText('common.swal.crud.updateSuccessTitle', '{item} actualizado').replace('{item}', itemName)
      : getText('common.swal.titles.updated')
    const text = itemName
      ? getText('common.swal.crud.updateSuccessText', 'El {item} ha sido actualizado exitosamente.').replace('{item}', itemName)
      : getText('common.swal.messages.updateSuccess')

    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showCreateSuccess = (itemName?: string): Promise<SweetAlertResult> => {
    const title = itemName
      ? getText('common.swal.crud.createSuccessTitle', '{item} creado').replace('{item}', itemName)
      : getText('common.swal.titles.created')
    const text = itemName
      ? getText('common.swal.crud.createSuccessText', 'El {item} ha sido creado exitosamente.').replace('{item}', itemName)
      : getText('common.swal.messages.createSuccess')

    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showDeleteSuccess = (itemName?: string): Promise<SweetAlertResult> => {
    const title = itemName
      ? getText('common.swal.crud.deleteSuccessTitle', '{item} eliminado').replace('{item}', itemName)
      : getText('common.swal.titles.deleted')
    const text = itemName
      ? getText('common.swal.crud.deleteSuccessText', 'El {item} ha sido eliminado exitosamente.').replace('{item}', itemName)
      : getText('common.swal.messages.deleteSuccess')

    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  // ==================== ERROR DIALOGS ====================

  const showError = (
    messageKey?: string,
    titleKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'error',
      title: getText(titleKey || 'common.swal.titles.error'),
      text: messageKey ? getText(messageKey) : getText('common.swal.messages.operationError'),
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showErrorWithMessage = (
    message: string,
    titleKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'error',
      title: getText(titleKey || 'common.swal.titles.error'),
      text: message,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showValidationError = (
    messageKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'error',
      title: getText('common.swal.titles.error'),
      text: messageKey ? getText(messageKey) : getText('common.swal.messages.validationError'),
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showAccessDenied = (): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'error',
      title: getText('common.swal.titles.accessDenied'),
      text: getText('common.swal.messages.accessDenied'),
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  // ==================== WARNING DIALOGS ====================

  const showWarning = (
    messageKey?: string,
    titleKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'warning',
      title: getText(titleKey || 'common.swal.titles.warning'),
      text: messageKey ? getText(messageKey) : undefined,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  // ==================== INFO DIALOGS ====================

  const showInfo = (
    messageKey?: string,
    titleKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'info',
      title: getText(titleKey || 'common.swal.titles.info'),
      text: messageKey ? getText(messageKey) : undefined,
      confirmButtonText: getText('common.swal.buttons.accept')
    })
  }

  const showFeatureInDevelopment = (): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'info',
      title: getText('common.swal.titles.inDevelopment'),
      text: getText('common.swal.messages.featureInDevelopment'),
      confirmButtonText: getText('common.swal.buttons.understood')
    })
  }

  const showComingSoon = (): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'info',
      title: getText('common.swal.titles.comingSoon'),
      text: getText('common.swal.messages.featureComingSoon'),
      confirmButtonText: getText('common.swal.buttons.understood')
    })
  }

  // ==================== CONFIRMATION DIALOGS ====================

  const showConfirm = (
    titleKey: string,
    textKey?: string,
    options?: {
      confirmButtonTextKey?: string
      cancelButtonTextKey?: string
      icon?: SweetAlertIcon
      confirmButtonColor?: string
      cancelButtonColor?: string
    }
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: options?.icon || 'question',
      title: getText(titleKey),
      text: textKey ? getText(textKey) : undefined,
      showCancelButton: true,
      confirmButtonColor: options?.confirmButtonColor || '#3085d6',
      cancelButtonColor: options?.cancelButtonColor || '#6c757d',
      confirmButtonText: getText(options?.confirmButtonTextKey || 'common.swal.buttons.yesConfirm'),
      cancelButtonText: getText(options?.cancelButtonTextKey || 'common.swal.buttons.cancel')
    })
  }

  const showConfirmDelete = (
    itemName?: string
  ): Promise<SweetAlertResult> => {
    const title = itemName
      ? getText('common.swal.crud.confirmDeleteTitle', '¿Eliminar {item}?').replace('{item}', itemName)
      : getText('common.swal.titles.confirm')
    const text = itemName
      ? getText('common.swal.crud.confirmDeleteText', '¿Está seguro de que desea eliminar este {item}? Esta acción no se puede deshacer.').replace('{item}', itemName)
      : getText('common.swal.messages.confirmDelete')

    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: getText('common.swal.buttons.yesDelete'),
      cancelButtonText: getText('common.swal.buttons.noKeep')
    })
  }

  const showConfirmAction = (
    titleKey: string,
    textKey?: string
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'question',
      title: getText(titleKey),
      text: textKey ? getText(textKey) : getText('common.swal.messages.confirmAction'),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: getText('common.swal.buttons.yesConfirm'),
      cancelButtonText: getText('common.swal.buttons.noCancel')
    })
  }

  const showConfirmCancel = (): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: 'warning',
      title: getText('common.swal.titles.confirm'),
      text: getText('common.swal.messages.confirmCancel'),
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: getText('common.swal.buttons.yesProceed'),
      cancelButtonText: getText('common.swal.buttons.noCancel')
    })
  }

  // ==================== LOADING DIALOGS ====================

  const showLoading = (
    titleKey?: string,
    textKey?: string
  ) => {
    Swal.fire({
      title: getText(titleKey || 'common.swal.titles.loading'),
      text: textKey ? getText(textKey) : getText('common.swal.messages.pleaseWait'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  const showProcessing = (
    titleKey?: string
  ) => {
    Swal.fire({
      title: getText(titleKey || 'common.swal.titles.processing'),
      text: getText('common.swal.messages.processingRequest'),
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

  // ==================== INPUT DIALOGS ====================

  const showPrompt = (
    titleKey: string,
    options?: {
      inputLabel?: string
      inputPlaceholder?: string
      inputValue?: string
      required?: boolean
    }
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title: getText(titleKey),
      input: 'text',
      inputLabel: options?.inputLabel,
      inputValue: options?.inputValue || '',
      inputPlaceholder: options?.inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: getText('common.swal.buttons.confirm'),
      cancelButtonText: getText('common.swal.buttons.cancel'),
      inputValidator: options?.required !== false
        ? (value) => {
            if (!value) {
              return getText('common.swal.messages.requiredFields')
            }
            return null
          }
        : undefined
    })
  }

  const showTextarea = (
    titleKey: string,
    options?: {
      inputLabel?: string
      inputPlaceholder?: string
      inputValue?: string
      required?: boolean
    }
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title: getText(titleKey),
      input: 'textarea',
      inputLabel: options?.inputLabel,
      inputValue: options?.inputValue || '',
      inputPlaceholder: options?.inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: getText('common.swal.buttons.confirm'),
      cancelButtonText: getText('common.swal.buttons.cancel'),
      inputValidator: options?.required !== false
        ? (value) => {
            if (!value) {
              return getText('common.swal.messages.requiredFields')
            }
            return null
          }
        : undefined
    })
  }

  // ==================== CUSTOM HTML DIALOGS ====================

  const showHtml = (
    titleKey: string,
    html: string,
    options?: {
      width?: string | number
      showCancelButton?: boolean
      confirmButtonTextKey?: string
      cancelButtonTextKey?: string
    }
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title: getText(titleKey),
      html,
      width: options?.width || 'auto',
      showCancelButton: options?.showCancelButton || false,
      confirmButtonText: getText(options?.confirmButtonTextKey || 'common.swal.buttons.accept'),
      cancelButtonText: options?.cancelButtonTextKey ? getText(options.cancelButtonTextKey) : undefined
    })
  }

  return {
    // Toast
    showToast,
    // Success
    showSuccess,
    showSaveSuccess,
    showUpdateSuccess,
    showCreateSuccess,
    showDeleteSuccess,
    // Error
    showError,
    showErrorWithMessage,
    showValidationError,
    showAccessDenied,
    // Warning
    showWarning,
    // Info
    showInfo,
    showFeatureInDevelopment,
    showComingSoon,
    // Confirm
    showConfirm,
    showConfirmDelete,
    showConfirmAction,
    showConfirmCancel,
    // Loading
    showLoading,
    showProcessing,
    closeLoading,
    // Input
    showPrompt,
    showTextarea,
    // Custom
    showHtml,
    // Helper
    getText
  }
}
