# 프로젝트 설명
<img width="1101" alt="스크린샷 2023-06-23 15 27 03" src="https://github.com/aesopfrom0/graba25/assets/72098049/4b6caeba-0fd3-44dd-a611-19f5b13a5bc6">

- [pomofocus.io](http://pomofocus.io)를 클로닝한 Pomodoro 시간관리 앱입니다.
- 사용자가 작업에 집중하고 효율적으로 시간을 관리할 수 있도록 도와줍니다.

# 기술 스택

- [React](https://reactjs.org/)

# 사용 방법

1. 프로젝트 클론
2. 의존관계 패키지 설치
    
    ```
    npm i
    ```
    
3. config/config.js 환경변수 파일 추가
    
    ```jsx
    export const GRABA25_API_INFO = {
      address: 'http://localhost:4000', // GRABA-API PORT
    };
    
    export const CLOCK_CONFIG = {
      pomodoroIntervalSeconds: 60 * 25,
      breakSeconds: 60 * 5,
    };
    ```
    
4. GRABA-API 실행
    1. https://github.com/aesopfrom0/graba25-be 참조
5. 애플리케이션 실행
    
    ```
    npm start
    ```
    
6. 브라우저에서 http://localhost:3000 오픈


#백로그
- 로그인 기능
- Long Break 탭 전환
- 시간 interval 기록
- task별 투입 시간 분석
