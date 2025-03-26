import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScenes';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene: BaseScene | null = null;
    private isTransitioning: boolean = false;

    constructor(app: PIXI.Application) {
        this.app = app;
        // Add ticker directly since app is already initialized
        const boundUpdate = (delta: number) => {
            if (this.currentScene && !this.isTransitioning) {
                this.currentScene.onUpdate(delta);
            }
        };
        app.ticker?.add((ticker) => boundUpdate(ticker.deltaTime));
    }

    // Remove initTicker method since we don't need it anymore
    // Remove requestAnimationFrame from update method
    update(delta: number): void {
        if (this.currentScene && !this.isTransitioning) {
            this.currentScene.onUpdate(delta);
        }
    }

    getApp(): PIXI.Application {
        return this.app;
    }

    async gotoScene(newScene: BaseScene): Promise<void> {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            if (this.currentScene) {
                await this.currentScene.onFinish();
                this.app.stage.removeChildren();
            }

            const container = new PIXI.Container();
            this.app.stage.addChild(container);
            this.currentScene = newScene;
            
            // Start scene immediately
            await newScene.onStart(container);
            // Force first update
            this.currentScene.onUpdate(0);
        } catch (error) {
            console.error('Scene transition error:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    getGameContainer() {
        return this.app.stage;
    }
}
