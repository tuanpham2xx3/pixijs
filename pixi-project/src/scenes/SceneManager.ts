import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScenes';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene: BaseScene | null = null;

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    // Lấy đối tượng application
    getApp(): PIXI.Application {
        return this.app;
    }

    // Chuyển đổi giữa các scene
    async gotoScene(newScene: BaseScene): Promise<void> {
        if (this.currentScene) {
            await this.currentScene.onFinish(); // Gọi phương thức dọn dẹp của scene hiện tại
            this.app.stage.removeChildren();   // Xóa tất cả các đối tượng khỏi stage
        }

        const container = new PIXI.Container();
        await newScene.onStart(container);     // Khởi tạo scene mới
        this.app.stage.addChild(container);   // Thêm container vào stage
        this.currentScene = newScene;         // Cập nhật scene hiện tại
    }

    // Cập nhật logic của scene hiện tại mỗi frame
    update(delta: number): void {
        if (this.currentScene) {
            this.currentScene.onUpdate(delta);
        }
    }
}
