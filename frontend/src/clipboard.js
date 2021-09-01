import { useEffect } from 'react'
import { Tooltip } from 'bootstrap'
import ClipboardJS from 'clipboard'

let clipboard = null
let tooltip = null

const useClipboard = (clipboardButtonRef, clipboardTargetRef, title) => {

  useEffect(() => {
    if (clipboard) {
      clipboard.destroy()
    }

    if (!clipboardButtonRef.current || !clipboardTargetRef.current) {
      return
    }

    tooltip = new Tooltip(clipboardButtonRef.current, {
      container: 'body',
      placement: 'top',
      title,
      trigger: 'manual'
    })

    clipboard = new ClipboardJS(clipboardButtonRef.current, {
      target() {
        return clipboardTargetRef.current
      }
    })

    clipboard.on('success', function (e) {
      e.clearSelection();
      tooltip.show()
      setTimeout(() => {
        tooltip.hide()
      }, 2000)
    })

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    })
  })

}


export default useClipboard
