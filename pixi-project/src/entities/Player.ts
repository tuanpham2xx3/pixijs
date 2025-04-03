import { Container, Sprite, Assets, Texture, AnimatedSprite, Spritesheet} from "pixi.js";

// Trạng thái
// Cập nhật lại enum PlayerState
enum PlayerState {
    IDLE = 'idle',
    RIGHT = 'right',
    LEFT = 'left',
    UP = 'up',
    UP_RIGHT = 'up_right',
    UP_LEFT = 'up_left',
    DOWN = 'down',
    DOWN_RIGHT = 'down_right',
    DOWN_LEFT = 'down_left'
}
// Interface cho options
interface PlayerOptions {
    x?: number;
    y?: number;
    scale?: number;
    spritesheet?: Spritesheet;
}

export class Player extends Container {
    // State hiện tại
    private currentState: PlayerState = PlayerState.IDLE;
    // Hướng nhìn ( 1: phải, -1 trái)
    private direction: number = 1;
    // Trạng thái di chuyển
    private isMoving: boolean = false;
    private sprite: AnimatedSprite | null = null;
    private animations: Map<PlayerState, AnimatedSprite> = new Map();

    constructor(options: PlayerOptions = {}) {
        super();

        // vị trí , tỉ lệ
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.scale.set(options.scale || 1);

        // Lưu trữ tài nguyên
        if (options.spritesheet) {
            this.initialize(options.spritesheet);
        }
    }
    // LOAD DATASHEET
    initialize(spritesheet: Spritesheet): void {
        // Create default texture array for each state
        for (const state of Object.values(PlayerState)) {
            // Use animations from spritesheet directly
            if (spritesheet.animations[state]) {
                const animatedSprite = new AnimatedSprite(spritesheet.animations[state]);
                animatedSprite.anchor.set(0.5);
                animatedSprite.animationSpeed = 0.1;
                animatedSprite.visible = false;
                
                this.addChild(animatedSprite);
                this.animations.set(state, animatedSprite);
            } else {
                console.warn(`Animation not found for state: ${state}`);
            }
        }

        // Set initial state
        this.setState(PlayerState.IDLE);
    }
    // Thay đổi trạng thái Player
    setState(newState: PlayerState): void {
        if (this.currentState === newState) return;
        
        // Dừng animation hiện tại
        const currentAnim = this.animations.get(this.currentState);
        if (currentAnim) {
            currentAnim.stop();
            currentAnim.visible = false;
        }

        // Kích hoạt animation mới
        const newAnim = this.animations.get(newState);
        if (newAnim) {
            newAnim.scale.x = Math.abs(newAnim.scale.x) * this.direction;
            newAnim.visible = true;
            newAnim.gotoAndPlay(0);
        }

        this.currentState = newState;
    }

    //dọn dẹp khi không dùng
    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; }): void {
        for (const anim of this.animations.values()) {
            anim.stop();
        }
        super.destroy(options);
    }

    // Thêm các phương thức di chuyển
    moveRight(): void {
        this.x += 2;
        this.setState(PlayerState.RIGHT);
    }

    moveLeft(): void {
        this.x -= 2;
        this.setState(PlayerState.LEFT);
    }

    moveUp(): void {
        this.y -= 2;
        this.setState(PlayerState.UP);
    }

    moveDown(): void {
        this.y += 2;
        this.setState(PlayerState.DOWN);
    }

    moveUpRight(): void {
        this.x += 2;
        this.y -= 2;
        this.setState(PlayerState.UP_RIGHT);
    }

    moveUpLeft(): void {
        this.x -= 2;
        this.y -= 2;
        this.setState(PlayerState.UP_LEFT);
    }

    moveDownRight(): void {
        this.x += 2;
        this.y += 2;
        this.setState(PlayerState.DOWN_RIGHT);
    }

    moveDownLeft(): void {
        this.x -= 2;
        this.y += 2;
        this.setState(PlayerState.DOWN_LEFT);
    }

    // Dừng di chuyển
    idle(): void {
        this.setState(PlayerState.IDLE);
    }
}
