function showLoadingModal(timeout = null) {
    document.getElementById('loadingModal').style.display = 'block';
    if (timeout && timeout instanceof integer) {
      setTimeout(() => {
        hideLoadingModal();
      }, timeout);
    }
}

function hideLoadingModal() {
    document.getElementById('loadingModal').style.display = 'none';
}