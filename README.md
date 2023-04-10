배포: https://chimerical-taffy-55fa8c.netlify.app/
![디벨로그](https://user-images.githubusercontent.com/48503261/230883311-5fe2952d-191e-4cfd-bc4d-5ad0c69bb49d.gif)
<br/><br/><br/>develog는 velog의 클론 사이트입니다!<br/><br/>
`회원가입` `로그인` `게시글` `댓글` `대댓글` `추천` `프로필설정` `시리즈` <br/><br/><br/><br/>
![image](https://user-images.githubusercontent.com/48503261/230884327-d5981d95-2c00-4064-8282-24186ba848d9.jpg)
<br/><br/><br/>MERN스택으로 만들어보았습니다.<br/><br/><br/>
![회원가입](https://user-images.githubusercontent.com/48503261/230887202-d3bb4641-f271-4a2b-b14e-0bf2db6ff382.png)
![로그인](https://user-images.githubusercontent.com/48503261/230887494-51bf129f-c3e3-4789-a36b-7047f71b28d8.png)
<br/><br/><br/>회원가입 페이지와, 로그인 모달입니다.<br/>
회원가입 요청을 백엔드로 보내면, bcrypt로 암호화하고 mongodb에 등록합니다. 로그인시 JWT토큰을 생성하여 브라우저에 전달되고 세션스토리지에 저장됩니다. 이후 인증이 필요할 때 마다 백엔드 서버에 토큰을 제출합니다. 자동로그인 설정시 로컬스토리지에 저장됩니다.<br/><br/><br/>
![스크린샷 2023-04-10 195640](https://user-images.githubusercontent.com/48503261/230889216-0f33c999-8fa2-4c75-84aa-f76f939c4477.png)
![스크린샷 2023-04-10 195724](https://user-images.githubusercontent.com/48503261/230889223-e655e71f-a241-496e-a8c9-9ae9d92627e7.png)
<br/><br/><br/>toast-ui/react-editor로 게시글 작성폼을 구현하였습니다. 게시글은 formdata와 multer을 통해 서버에 전송되어 업로드됩니다.<br/><br/><br/>
![스크린샷 2023-04-10 200208](https://user-images.githubusercontent.com/48503261/230889746-c3266261-ba17-426d-ae6f-67431f5f279a.png)
<br/><br/><br/>홈 화면에서 게시글들을 추천순, 최신순으로 정렬할 수 있고 날짜로 필터링 할 수 있습니다.<br/><br/><br/>
![스크린샷 2023-04-10 201109](https://user-images.githubusercontent.com/48503261/230891021-a9711037-622e-4c4a-80e6-f85925b9553b.png)
![스크린샷 2023-04-10 201125](https://user-images.githubusercontent.com/48503261/230890996-31e8902d-ae32-434b-89c6-b4050e0decdb.png)
<br/><br/><br/>게시물 페이지에서 추천과 댓글, 대댓글을 작성할 수 있습니다.<br/><br/><br/>
![스크린샷 2023-04-10 201425](https://user-images.githubusercontent.com/48503261/230891336-ff92748c-8b70-4809-b0e2-8abe27b628e3.png)
<br/><br/><br/>유저 페이지에서 해당 유저의 게시글과 시리즈를 볼 수 있습니다.<br/><br/><br/>
![스크린샷 2023-04-10 201522](https://user-images.githubusercontent.com/48503261/230891423-f7024c0e-b994-4317-8e98-774e5cf2452e.png)
<br/><br/><br/>설정 페이지에서 프로필을 수정할 수 있습니다.<br/><br/><br/>
