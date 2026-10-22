        const savePhoneDialog = document.getElementById('save-phone-dialog');
        const savePhoneButtons = [...document.querySelectorAll('[data-save-phone]')];
        const savePhoneLabels = new Map(savePhoneButtons.map(button => [button, button.firstChild.textContent]));
        let installPrompt = null;
        const alreadyInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            if (alreadyInstalled()) return;
            installPrompt = event;
            savePhoneButtons.forEach(button => {
                button.hidden = false;
                button.firstChild.textContent = 'Save page ';
                button.removeAttribute('aria-controls');
            });
        });
        window.addEventListener('appinstalled', () => {
            installPrompt = null;
            savePhoneButtons.forEach(button => { button.hidden = true; });
            if (savePhoneDialog.open) savePhoneDialog.close();
        });
        if (typeof savePhoneDialog.showModal === 'function') {
            savePhoneButtons.forEach(button => {
                button.hidden = alreadyInstalled();
                button.addEventListener('click', async () => {
                    if (!installPrompt) {
                        savePhoneDialog.showModal();
                        return;
                    }
                    const prompt = installPrompt;
                    installPrompt = null;
                    savePhoneButtons.forEach(item => { item.disabled = true; });
                    try {
                        await prompt.prompt();
                        await prompt.userChoice;
                    } catch {
                        savePhoneDialog.showModal();
                    } finally {
                        savePhoneButtons.forEach(item => {
                            item.disabled = false;
                            item.setAttribute('aria-controls', 'save-phone-dialog');
                            item.firstChild.textContent = savePhoneLabels.get(item);
                        });
                    }
                });
            });
            savePhoneDialog.addEventListener('click', event => {
                const bounds = savePhoneDialog.getBoundingClientRect();
                if (event.target === savePhoneDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
                    savePhoneDialog.close();
                }
            });
        }
        const cvDialog = document.getElementById('cv-scan-dialog');
        if (typeof cvDialog.showModal === 'function') {
            document.querySelectorAll('[data-cv-scan]').forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    cvDialog.showModal();
                });
            });
            cvDialog.addEventListener('click', event => {
                const bounds = cvDialog.getBoundingClientRect();
                if (event.target === cvDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
                    cvDialog.close();
                }
            });
        }
        const copyButton = document.getElementById('copy-email');
        const copyStatus = document.getElementById('copy-status');
        if (navigator.clipboard && window.isSecureContext) {
            copyButton.hidden = false;
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(document.querySelector('.email-link').textContent);
                    copyStatus.textContent = 'Email copied. Ready to paste into your message.';
                } catch {
                    copyStatus.textContent = 'Couldn’t copy automatically. Use the email link above.';
                }
            });
        }
