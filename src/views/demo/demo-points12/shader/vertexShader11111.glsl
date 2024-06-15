#include <GL/glut.h>

#define MAX_PARTICLES 1000       // 最大粒子数
#define PARTICLE_RADIUS 0.5f     // 粒子半径

static GLfloat pos[MAX_PARTICLES][3];    // 粒子位置
static GLfloat vel[MAX_PARTICLES][3];    // 粒子速度
static GLubyte col[MAX_PARTICLES][4];    // 粒子颜色
void drawScene() {

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // 画粒子
    glBegin(GL_POINTS);
    for (int i = 0; i < MAX_PARTICLES; i++) {
        glColor4ub(col[i][0], col[i][1], col[i][2], col[i][3]);
        glVertex3f(pos[i][0], pos[i][1], pos[i][2]);
    }
    glEnd();

    // 计算粒子位置和速度
    for (int i = 0; i < MAX_PARTICLES; i++) {
        vel[i][1] += 0.0001f;    // 向上的速度增加
        pos[i][0] += vel[i][0];
        pos[i][1] += vel[i][1];
        pos[i][2] += vel[i][2];
        col[i][3] -= 0.001f;      // 粒子透明度减少
    }
    // 如果透明度小于等于0, 重新随机生成粒子位置、速度和颜色
    for (int i = 0; i < MAX_PARTICLES; i++) {
        if (col[i][3] <= 0) {
            col[i][0] = rand() % 256;
            col[i][1] = rand() % 256;
            col[i][2] = rand() % 256;
            col[i][3] = 255;
            pos[i][0] = 0;
            pos[i][1] = 0;
            pos[i][2] = 0;
            vel[i][0] = ((rand() % 100) - 50) / 500.0f;
            vel[i][1] = ((rand() % 100) - 50) / 500.0f;
            vel[i][2] = ((rand() % 100) - 50) / 500.0f;
        }
    }

    glutSwapBuffers();
}

void init() {
    glClearColor(0.0, 0.0, 0.0, 1.0);
    glMatrixMode(GL_PROJECTION);
    gluPerspective(60, 1, 0.1, 100);
    glMatrixMode(GL_MODELVIEW);
    gluLookAt(0, 5, 20, 0, 0, 0, 0, 1, 0);

    // 初始化粒子位置、速度和颜色
    for (int i = 0; i < MAX_PARTICLES; i++) {
        col[i][0] = rand() % 256;
        col[i][1] = rand() % 256;
        col[i][2] = rand() % 256;
        col[i][3] = 255;
        pos[i][0] = 0;
        pos[i][1] = 0;
        pos[i][2] = 0;
        vel[i][0] = ((rand() % 100) - 50) / 500.0f;
        vel[i][1] = ((rand() % 100) - 50) / 500.0f;
        vel[i][2] = ((rand() % 100) - 50) / 500.0f;
    }
}

int main(int argc, char *argv[]) {
    glutInit(&argc, argv);
glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);
glutInitWindowSize(600, 600);
glutCreateWindow("Effect");

init();
glutDisplayFunc(drawScene);
glutIdleFunc(drawScene);
glutMainLoop();

return 0;
}

