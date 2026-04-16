export class Model {
    constructor() {
        // Points to your specific JSONPlaceholder API on GitHub
        this.apiBaseUrl = 'https://github.com/DarajahH/Burger-Database'; 
        this.reset();
    }

    // Fetches the array of burgers
    async fetchBurgers() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/burgers`);
            return await response.json();
        } catch (err) {
            console.error("Error fetching burgers:", err);
            return [];
        }
    }

    // Fetches specific burger details asynchronously
async fetchBurgers() {
        try {
            // Changed /burgers to /bases
            const response = await fetch(`${this.apiBaseUrl}/bases`); 
            return await response.json();
        } catch (err) {
            console.error("Error fetching bases:", err);
            return [];
        }
    }

    reset() {
        this.state = {
            userName: 'Guest',
            selectedBurger: null,
            steps: [],
            currentStepIndex: 0,
            selections: {},
            feedbackMessage: null,
            skippedSteps: 0 
        };
    }

    setUserName(name) {
        if(name.trim() !== '') {
            this.state.userName = name;
        }
    }

    setBurger(burger) {
        this.state.selectedBurger = burger;
        this.state.steps = burger.steps;
        this.state.currentStepIndex = 0;
        this.state.selections = {};
        this.state.feedbackMessage = null;
        this.state.skippedSteps = 0;
    }

    getCurrentStep() {
        if (this.state.feedbackMessage) return { type: 'feedback', message: this.state.feedbackMessage };
        if (this.state.currentStepIndex >= this.state.steps.length) return null; // Finished
        return this.state.steps[this.state.currentStepIndex];
    }

    recordInput(value) {
        const step = this.state.steps[this.state.currentStepIndex];
        
        // Save selection for summary
        this.state.selections[step.name] = value;

        // Check feedback condition
        if (step.feedback && step.feedback.condition) {
            const valNum = parseInt(value, 10);
            if (eval(step.feedback.condition.replace('value', valNum))) {
                this.state.feedbackMessage = step.feedback.message;
                return false; // Triggers feedback view
            }
        }
        
        this.state.currentStepIndex++;
        return true; 
    }

    skipCurrentStep() {
        this.state.skippedSteps++;
        this.state.currentStepIndex++;
    }

    clearFeedback() {
        this.state.feedbackMessage = null;
        this.state.currentStepIndex++; // Move past the problematic step
    }

    isOrderPerfect() {
        return this.state.skippedSteps === 0;
    }

    getSummaryData() {
        return {
            name: this.state.userName,
            burgerName: this.state.selectedBurger ? this.state.selectedBurger.title : 'None Selected',
            selections: this.state.selections
        };
    }
}