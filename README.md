## 실행

```bash
pnpm install
pnpm dev
```

<br>

## 프로젝트 구조

- app/: 라우팅만 얇게(페이지 컴포넌트는 거의 widgets/features 조립)
- entities/: API + 타입(도메인 데이터)
- features/: “행동/유스케이스” 단위 (로그인, 회원가입 step, 매칭 요청/수락, 친구 수락 등)
- widgets/: 화면 조립용 큰 UI 블록 (Header, BottomNav, TeamCard, ChatRoom 등)
- shared/: 완전 재사용 UI/유틸

<br>

```
frontend_react
├─ .prettierrc
├─ README.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ fonts
│  │  ├─ DNFBitBitv2.otf
│  │  ├─ Pretendard-Bold.woff2
│  │  ├─ Pretendard-ExtraBold.woff2
│  │  ├─ Pretendard-Light.woff2
│  │  ├─ Pretendard-Medium.woff2
│  │  └─ Pretendard-Regular.woff2
│  ├─ icons
│  │  ├─ buting-logo-192.png
│  │  └─ buting-logo-512.png
│  └─ manifest.json
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  └─ signup
│  │  │     ├─ page.tsx
│  │  │     ├─ step-1
│  │  │     │  └─ page.tsx
│  │  │     ├─ step-2
│  │  │     │  └─ page.tsx
│  │  │     ├─ step-3
│  │  │     │  └─ page.tsx
│  │  │     └─ step-4
│  │  │        └─ page.tsx
│  │  ├─ (main)
│  │  │  ├─ chats
│  │  │  │  └─ page.tsx
│  │  │  ├─ friends
│  │  │  │  └─ page.tsx
│  │  │  ├─ home
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ matching
│  │  │  │  └─ page.tsx
│  │  │  ├─ notifications
│  │  │  │  └─ page.tsx
│  │  │  ├─ profile
│  │  │  │  └─ page.tsx
│  │  │  └─ teams
│  │  │     ├─ [teamId]
│  │  │     │  └─ page.tsx
│  │  │     └─ new
│  │  │        ├─ page.tsx
│  │  │        ├─ step-1
│  │  │        │  └─ page.tsx
│  │  │        ├─ step-2
│  │  │        │  └─ page.tsx
│  │  │        └─ step-3
│  │  │           └─ page.tsx
│  │  ├─ (public)
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ splash
│  │  │     └─ page.tsx
│  │  ├─ chats
│  │  │  └─ [roomId]
│  │  │     └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ providers.tsx
│  ├─ assets
│  │  ├─ icons
│  │  │  └─ chat.png
│  │  ├─ images
│  │  │  └─ splash-background.png
│  │  └─ logos
│  │     ├─ buting-logo-title.png
│  │     └─ buting-logo.png
│  ├─ entities
│  │  ├─ chat
│  │  │  ├─ api
│  │  │  └─ model
│  │  ├─ friend
│  │  │  ├─ api
│  │  │  └─ model
│  │  ├─ match
│  │  │  ├─ api
│  │  │  └─ model
│  │  ├─ notification
│  │  │  ├─ api
│  │  │  └─ model
│  │  ├─ team
│  │  │  ├─ api
│  │  │  └─ model
│  │  └─ user
│  │     ├─ api
│  │     └─ model
│  ├─ features
│  │  ├─ auth
│  │  │  └─ kakao-login
│  │  │     ├─ lib
│  │  │     └─ ui
│  │  ├─ chat
│  │  ├─ friend
│  │  ├─ matching
│  │  ├─ profile
│  │  ├─ signup
│  │  │  ├─ model
│  │  │  │  └─ signup.store.ts
│  │  │  └─ ui
│  │  │     ├─ parts
│  │  │     │  ├─ AgeFenderForm.tsx
│  │  │     │  ├─ AnimalPicker.tsx
│  │  │     │  ├─ CollegeSelect.tsx
│  │  │     │  ├─ EmailVerifyForm.tsx
│  │  │     │  ├─ FaceAnalyze.tsx
│  │  │     │  ├─ KeywordPicker.tsx
│  │  │     │  ├─ MbtiPicker.tsx
│  │  │     │  ├─ NicknameForm.tsx
│  │  │     │  └─ OneLiner.tsx
│  │  │     └─ steps
│  │  │        ├─ Step1Kakao.tsx
│  │  │        ├─ Step2Profile.tsx
│  │  │        ├─ Step3Personality.tsx
│  │  │        └─ Step4Avator.tsx
│  │  └─ team
│  │     └─ create-team
│  │        ├─ model
│  │        │  └─ createTeam.store.ts
│  │        └─ ui
│  │           ├─ parts
│  │           │  ├─ MemberChips.tsx
│  │           │  ├─ MemberSearch.tsx
│  │           │  └─ PreferenceChips.tsx
│  │           └─ steps
│  │              ├─ Step1Basic.tsx
│  │              ├─ Step2Preference.tsx
│  │              └─ Step3Members.tsx
│  ├─ shared
│  │  ├─ config
│  │  ├─ lib
│  │  ├─ styles
│  │  │  ├─ borderRadius.ts
│  │  │  ├─ boxShadow.ts
│  │  │  ├─ colors.ts
│  │  │  ├─ fonts.ts
│  │  │  └─ index.ts
│  │  └─ ui
│  └─ widgets
│     ├─ bottom-nav
│     │  └─ BottomNav.tsx
│     ├─ chat-room
│     │  ├─ ChatRoomHeader.tsx
│     │  ├─ MessageBubble.tsx
│     │  └─ MessageList.tsx
│     ├─ header
│     │  └─ MainHeader.tsx
│     ├─ notification-list
│     │  └─ NotificationList.tsx
│     ├─ splash
│     │  ├─ Splash.tsx
│     │  └─ ui
│     │     └─ SplashButtons.tsx
│     └─ team-card
│        └─ TeamCard.tsx
├─ tailwind.config.ts
└─ tsconfig.json

```
