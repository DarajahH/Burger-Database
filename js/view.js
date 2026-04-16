export class View {
    constructor() {
        this.appView = document.getElementById('app-view');
        this.summaryView = document.getElementById('order-summary');
        this.templates = {};
        this.initTemplates();
    }

    initTemplates() {
        const tplIds = ['home', 'burger-select', 'step-multiple-choice', 'step-text', 'step-image', 'feedback', 'final', 'summary'];
        tplIds.forEach(id => {
            const scriptTag = document.getElementById(`${id}-template`);
            if (scriptTag) {
                this.templates[id] = Handlebars.compile(scriptTag.innerHTML);
            } else {
                console.error(`Template ${id}-template not found.`);
            }
        });
    }

    render(viewName, data = {}) {
        if (this.templates[viewName]) {
            this.appView.innerHTML = this.templates[viewName](data);
        }
    }

    renderSummary(data) {
        if (this.templates['summary']) {
            this.summaryView.innerHTML = this.templates['summary'](data);
        }
    }

    showConfirmation(message, callback) {
        const msgDiv = document.getElementById('confirmation-msg');
        if(msgDiv) {
            msgDiv.textContent = message;
            // Requirement: 1000ms delay
            setTimeout(() => {
                callback();
            }, 1000);
        } else {
            callback(); 
        }
    }
}