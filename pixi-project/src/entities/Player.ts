import { Container, Sprite, Assets, Texture, AnimatedSprite, Spritesheet} from "pixi.js";

// Trạng thái
enum PlayerState {
    IDLE = 'idle',
    RUN = 'run',
    JUMP = 'jump',
    ATTACK = 'attack'
}
// Bộ phận
enum PlayerPart {
    HEAD = 'head',
    BODY = 'body',
    FEET = 'feet'
}
// Interface cho options
interface PlayerOptions {
    x?: number;
    y?: number;
    scale?: number;
    resources?: {
        head: Spritesheet;
        body: Spritesheet;
        feet: Spritesheet;
      };
}

export class Player extends Container {
    // Khai báo parts có kiểu MAP gồm PlayerPart và Container
    private parts: Map<PlayerPart, Container> = new Map();
    // Khai báo kiểu hoạt ảnh cho trạng thái của mỗi bộ phận
    private animations: Map<PlayerPart, Map<PlayerState, AnimatedSprite>> = new Map();
    // State hiện tại
    private currentState: PlayerState = PlayerState.IDLE;
    // Hướng nhìn ( 1: phải, -1 trái)
    private direction: number = 1;
    // Trạng thái di chuyển
    private isMoving: boolean = false;
      // Tài nguyên đã tải
    private resources?: {
        head: Spritesheet;
        body: Spritesheet;
        feet: Spritesheet;
    };
    private isJumping: boolean = false;

    constructor(options: PlayerOptions = {}) {
        super();

        // vị trí , tỉ lệ
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.scale.set(options.scale || 1);

        // Lưu trữ tài nguyên
        this.resources = options.resources;

        // khơie tạo container cho mỗi bộ phận
        this.initializeParts();
    }

    private initializeParts(): void {
        // Container HEAD
        const headContainer = new Container();
        this.addChild(headContainer);
        this.parts.set(PlayerPart.HEAD, headContainer);

        // BODY
        const bodyContainer = new Container();
        this.addChild(bodyContainer);
        this.parts.set(PlayerPart.BODY, bodyContainer);

        //FEET
        const feetContainer = new Container();
        this.addChild(feetContainer);
        this.parts.set(PlayerPart.FEET, feetContainer);

        // Vị trí
        headContainer.y = -19;
        bodyContainer.y = -8;
        feetContainer.y = 0;
        if(this.currentState === PlayerState.RUN) {
            console.log('Running state detected, adjusting feet position');
            feetContainer.y = -20;
        }

        // Khởi tạo Maps animations
        for (const part of Object.values(PlayerPart)) {
            this.animations.set(part, new Map());
        }
    }

    // LOAD DATASHEET
    initialize(): void {
        if (!this.resources) {
          console.error('Cannot initialize player: resources not provided');
          return;
        }
        // Thiết lập animations cho từng bộ phận
        this.setupAnimations(PlayerPart.HEAD, this.resources.head);
        this.setupAnimations(PlayerPart.BODY, this.resources.body);
        this.setupAnimations(PlayerPart.FEET, this.resources.feet);
        
        // Thiết lập trạng thái mặc định
        this.setState(PlayerState.IDLE);
        
        console.log('Player initialized successfully');
    }
    // Thiết lập Animation cho mỗi bộ phận
    private setupAnimations(part: PlayerPart, spritesheet: Spritesheet): void {
        // Lấy container cho bộ phận này
        const container = this.parts.get(part);
        if (!container) return;
        
        // Tạo AnimatedSprite cho mỗi trạng thái
        for (const state of Object.values(PlayerState)) {
          // Tên animation trong spritesheet (ví dụ: "head_idle", "body_run")
          const animationName = `${part}_${state}`;
          
          // Kiểm tra xem animation có tồn tại trong spritesheet không
          if (spritesheet.animations[animationName]) {
            // Tạo AnimatedSprite từ textures
            const animatedSprite = new AnimatedSprite(
              spritesheet.animations[animationName]
            );
            
            // Thiết lập thuộc tính
            animatedSprite.anchor.set(0.5);
            animatedSprite.animationSpeed = 0.1;
            animatedSprite.visible = false;
            
            // Thêm vào container
            container.addChild(animatedSprite);
            
            // Lưu trữ reference
            const stateAnimations = this.animations.get(part);
            if (stateAnimations) {
              stateAnimations.set(state as PlayerState, animatedSprite);
            }
          }
        }
      }
    
    // Thay đổi trạng thái Player
    setState(newState: PlayerState): void {
        //Nếu đang ở trạng thái đó
        if(this.currentState === newState) return;

        // Trạng thái mới
        this.currentState = newState;

        // Cập nhật animation mỗi phần
        for(const part of Object.values(PlayerPart)) {
            this.updatePartAnimation(part, newState);
        }
        const feetContainer = this.parts.get(PlayerPart.FEET);
        if (feetContainer) {
            if (newState === PlayerState.RUN) {
                feetContainer.y = -0.5;
            } else {
                feetContainer.x = 0; // Reset về vị trí mặc định
            }
        }
    }

    // Cập nhật Animation cho mỗi bộ phận
    private updatePartAnimation(part: PlayerPart,state:PlayerState): void {
        //Lấy map animation cho bộ phận này
        const partAnimations = this.animations.get(part);
        if(!partAnimations) return;

        // Dừng animation của state hiện tại
        for (const anim of partAnimations.values()) {
            anim.stop();
            anim.visible = false;
        }

        // Animation cho state mới
        const newAnimation = partAnimations.get(state);

        if (newAnimation) {
            // update direction (hướng nhìn)
            newAnimation.scale.x = Math.abs(newAnimation.scale.x) * this.direction;

            // Hiện thị và chạy animation mới
            newAnimation.visible = true;
            newAnimation.gotoAndPlay(0);
        }
    }

    // di chuyển trái
    moveLeft(): void {
        this.direction = -1;
        this.x -= 2;
        this.isMoving = true;

        // Update direction
        this.updateDirection();

        if (this.currentState !== PlayerState.JUMP) {
            this.setState(PlayerState.RUN);
        }
        
    }
    // di chuyển phải
    moveRight(): void {
        this.direction = 1;
        this.x += 2;
        this.isMoving = true;

        // Update direction
        this.updateDirection();

        if (this.currentState !== PlayerState.JUMP) {
            this.setState(PlayerState.RUN);
        }
    }

    // Update direction cho các bộ phận
    private updateDirection(): void {
        for (const part of Object.values(PlayerPart)) {
            const partAnimations = this.animations.get(part);
            if(!partAnimations) continue;

            const currentAnim = partAnimations.get(this.currentState);
            if (currentAnim) {
                currentAnim.scale.x = Math.abs(currentAnim.scale.x) * this.direction;
            }
        }
    }

    //Nhảy
    jump(): void {
        if (!this.isJumping) {
            this.isJumping = true;
            this.setState(PlayerState.JUMP);
    
            // Mô phỏng jump
            const jumpHeight = 100;
            const jumpDuration = 500;
    
            //Animation jump
            const startY = this.y;
            let startTime = performance.now();
            
            const animateJump = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / jumpDuration, 1);
    
                // nhảy theo đường cong
                const jumpProgress = -4 * Math.pow(progress - 0.5, 2) + 1;
                this.y = startY - jumpHeight * jumpProgress;
    
                if (progress < 1) {
                    requestAnimationFrame(animateJump);
                } else {
                    this.y = startY; // trở lại vị trí y cũ
                    this.isJumping = false;
                    if (this.isMoving) {
                        this.setState(PlayerState.RUN);
                    } else {
                        this.setState(PlayerState.IDLE);
                    }
                }
            };
            requestAnimationFrame(animateJump);
        }
    }
    //Tấn công
    attack(): void {
        this.setState(PlayerState.ATTACK);
        
        //
        setTimeout(() => {
            this.setState(PlayerState.IDLE);
        },500); // 500ms thời gian tấn công
    }
    //đứng yên
    idle(): void {
        this.isMoving = false;
        if (this.currentState !== PlayerState.JUMP && this.currentState !== PlayerState.ATTACK) {
            this.setState(PlayerState.IDLE);
        }
    }
    //dọn dẹp khi không dùng
    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; }): void {
        // Dừng tất cả animations
        for (const part of Object.values(PlayerPart)) {
          const partAnimations = this.animations.get(part);
          if (partAnimations) {
            for (const anim of partAnimations.values()) {
              anim.stop();
            }
          }
        }
        
        super.destroy(options);
    }
}
