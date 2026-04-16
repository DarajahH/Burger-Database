import { Model } from './model.js';
import { View } from './view.js';

export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View();
        this.init();
    }

    init() {
        this.model.reset();
        this.view.render('home');
        this.view.renderSummary(this.model.getSummaryData());
        
        document.getElementById('start-btn').addEventListener('click', () => {
            const name = document.getElementById('user-name-input').value;
            this.model.setUserName(name);
            this.loadBurgerSelection();
        });
    }

    async loadBurgerSelection() {
        const burgers = await this.model.fetchBurgers();
        this.view.render('burger-select', { burgers });
        this.view.renderSummary(this.model.getSummaryData());

        const btns = document.querySelectorAll('.select-burger-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await this.model.fetchBurgerDetails(id);
                this.view.renderSummary(this.model.getSummaryData());
                this.renderCurrentStep();
            });
        });
    }

    renderCurrentStep() {
        const step = this.model.getCurrentStep();
        
        // Handle end of order
        if (!step) {
            const isPerfect = this.model.isOrderPerfect();
            const userName = this.model.state.userName;
            const msg = isPerfect 
                ? `Thank you, ${userName}! Your burger is on the grill!`
                : `Oops, ${userName}! You skipped a few steps. Want to try again?`;

            this.view.render('final', { message: msg });
            document.getElementById('restart-btn').addEventListener('click', () => this.init());
            return;
        }

        // Handle feedback
        if (step.type === 'feedback') {
            this.view.render('feedback', { message: step.message });
            document.getElementById('got-it-btn').addEventListener('click', () => {
                this.model.clearFeedback();
                this.renderCurrentStep();
            });
            return;
        }

        // Render input step types
        if (step.type === 'multiple-choice') {
            this.view.render('step-multiple-choice', step);
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const val = e.currentTarget.getAttribute('data-value');
                    this.handleStepInput(val);
                });
            });
        } 
        else if (step.type === 'text') {
            this.view.render('step-text', step);
            document.getElementById('submit-text-btn').addEventListener('click', () => {
                const val = document.getElementById('text-step-input').value;
                if(val !== '') this.handleStepInput(val);
            });
        } 
        else if (step.type === 'image-selection') {
            this.view.render('step-image', step);
            document.querySelectorAll('.image-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const val = e.currentTarget.getAttribute('data-value');
                    this.handleStepInput(val);
                });
            });
        }

        // Bind Skip Button
        const skipBtn = document.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.model.skipCurrentStep();
                this.renderCurrentStep();
            });
        }
    }

    handleStepInput(value) {
        const messages = ['Great choice!', 'Extra tasty!', 'Nice pick!'];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        // Show confirmation before progressing
        this.view.showConfirmation(randomMsg, () => {
            this.model.recordInput(value);
            this.view.renderSummary(this.model.getSummaryData());
            this.renderCurrentStep();
        });
    }
}