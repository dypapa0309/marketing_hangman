import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTDeioxx6a3uoc3JFpTqAZZyUz21ijqTA",
  authDomain: "marketinghangman.firebaseapp.com",
  databaseURL: "https://marketinghangman-default-rtdb.firebaseio.com",
  projectId: "marketinghangman",
  storageBucket: "marketinghangman.appspot.com",
  messagingSenderId: "573435667095",
  appId: "1:573435667095:web:68cf56ccb05aa3d34ebfd2",
  measurementId: "G-YPKXCHXZCX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 마케팅 용어 목록
const words = {
    '브랜딩': '제품이나 서비스의 독특한 정체성을 만들고 유지하는 과정',
    '마케팅': '고객의 필요와 욕구를 파악하고 충족시키는 활동',
    '광고': '제품이나 서비스를 홍보하기 위한 유료 커뮤니케이션',
    '프로모션': '제품이나 서비스의 판매를 촉진하기 위한 다양한 활동',
    '세일즈': '제품이나 서비스를 고객에게 직접 판매하는 활동',
    '퍼널': '고객이 제품을 구매하기까지의 단계적 과정',
    '리드': '잠재 고객의 정보와 관심',
    '컨버전': '방문자가 목표한 행동을 완료하는 것',
    '타겟팅': '특정 고객 그룹을 대상으로 마케팅 활동을 집중하는 것',
    '인플루언서': '소셜 미디어에서 영향력 있는 개인',
    'SEO': '검색 엔진 최적화',
    'PPC': '클릭당 지불 광고',
    'CTA': '행동 유도 문구',
    'ROI': '투자 수익률',
    'KPI': '핵심 성과 지표',
    'CRM': '고객 관계 관리',
    '바이럴': '입소문을 통해 빠르게 확산되는 마케팅 방식',
    '콘텐츠': '사용자에게 가치를 제공하는 정보나 경험',
    '리타겟팅': '이전에 관심을 보인 고객을 대상으로 다시 마케팅하는 것',
    '퍼포먼스': '성과 중심의 마케팅 활동',
    'B2B': '기업과 기업 간의 거래',
    'B2C': '기업과 소비자 간의 거래',
    'CPC': '클릭당 비용',
    'CPM': '1000회 노출당 비용',
    '이메일마케팅': '이메일을 통한 마케팅 활동',
    'SNS마케팅': '소셜 네트워크 서비스를 활용한 마케팅',
    '네이티브광고': '콘텐츠와 자연스럽게 어우러지는 광고',
    '퍼미션마케팅': '고객의 동의를 얻은 마케팅 활동',
    '제로모멘트': '구매 결정의 순간',
    '마이크로모멘트': '소비자의 즉각적인 정보 탐색 순간',
    '그로스해킹': '빠른 성장을 위한 실험적 마케팅 기법',
    '인바운드마케팅': '고객이 자발적으로 찾아오게 하는 마케팅',
    '아웃바운드마케팅': '기업이 고객에게 직접 다가가는 마케팅',
    '옴니채널': '모든 채널을 통합한 일관된 고객 경험 제공',
    '멀티채널': '여러 채널을 통한 마케팅 활동',
    '크로스채널': '여러 채널 간의 연계된 마케팅 활동',
    '퍼스널브랜딩': '개인의 브랜드 가치를 높이는 활동',
    '게릴라마케팅': '창의적이고 비관습적인 마케팅 방식',
    '버즈마케팅': '화제성을 통해 입소문을 유발하는 마케팅',
    '구전마케팅': '고객들 사이의 입소문을 활용한 마케팅',
    '에지마케팅': '틈새시장을 공략하는 마케팅 전략',
    '블로그마케팅': '블로그를 활용한 마케팅 활동',
    '인플루언서마케팅': '영향력 있는 개인을 통한 마케팅',
    '제휴마케팅': '다른 기업과의 제휴를 통한 마케팅',
    '옵트인': '고객의 자발적인 정보 제공 동의',
    '옵트아웃': '고객의 정보 수신 거부',
    '랜딩페이지': '광고 클릭 후 도달하는 웹페이지',
    '카피라이팅': '광고문구 작성',
    '밸류프로포지션': '고객에게 제공하는 가치 제안',
    '포지셔닝': '경쟁사와 차별화된 위치 설정',
    '세그멘테이션': '시장 세분화',
    '퍼소나': '가상의 목표 고객 프로필',
    '고객여정': '고객의 구매 과정 전반',
    '터치포인트': '고객과 브랜드가 접촉하는 모든 지점',
    'A/B테스트': '두 가지 버전을 비교 테스트하는 방법',
    '리드스코어링': '잠재 고객의 구매 가능성 점수화',
    '리드너처링': '잠재 고객을 육성하는 과정',
    '밸류프롭': '고객에게 제공하는 가치',
    '브랜드아이덴티티': '브랜드의 정체성',
    '브랜드에쿼티': '브랜드의 자산 가치',
    '로열티프로그램': '고객 충성도 프로그램',
    '인게이지먼트': '고객 참여도',
    '바운스레이트': '웹사이트 이탈률',
    '매출기여도': '마케팅 활동이 매출에 기여한 정도',
    '마케팅믹스': '마케팅 전략의 요소 조합',
    '4P': '제품, 가격, 유통, 프로모션',
    '7P': '4P에 사람, 물리적 증거, 과정을 추가',
    'USP': '독특한 판매 제안',
    'SWOT분석': '강점, 약점, 기회, 위협 분석',
    'PEST분석': '정치, 경제, 사회, 기술 환경 분석',
    '고객생애가치': '고객이 평생 창출할 수 있는 가치',
    '퍼널분석': '고객 구매 과정의 각 단계별 전환율 분석',
    '코호트분석': '특정 그룹의 행동을 시간에 따라 분석',
    'NPS': '고객 추천 지수',
    'CSAT': '고객 만족도',
    'CES': '고객 노력 점수',
    '그로스마케팅': '빠른 성장에 초점을 맞춘 마케팅',
    '컨텐츠마케팅': '가치 있는 컨텐츠를 통한 마케팅',
    '디지털마케팅': '디지털 채널을 활용한 마케팅',
    '모바일마케팅': '모바일 기기를 대상으로 한 마케팅',
    '애드테크': '광고 기술',
    '마테크': '마케팅 기술',
    '프로그래매틱광고': '자동화된 광고 구매 및 판매',
    '리마케팅': '이전 방문자를 대상으로 한 광고',
    '네트워크효과': '사용자가 늘수록 가치가 증가하는 현상',
    '바이럴루프': '자가 증식하는 마케팅 효과',
    '롱테일': '적은 수요의 다양한 제품군',
    '프리미엄': '고품질 고가격 전략',
    '프리미어경제': '무료 서비스로 유료 고객 유치',
    '인플루언서': '소셜 미디어에서 영향력 있는 개인',
    '팔로워': '소셜 미디어에서의 추종자',
    '해시태그': '소셜 미디어의 키워드 표시',
    '트렌드': '현재의 경향이나 추세',
    '바이럴': '입소문을 통해 빠르게 확산되는 현상',
    '밈': '문화적 요소가 모방되어 전파되는 현상',
    '인게이지먼트': '고객의 참여도',
    '리치': '콘텐츠의 도달 범위'
};

let selectedWord = '';
let displayedWord = '';
let guessedLetters = [];
let wrongLetters = [];
let remainingGuesses = 10;
let revealedLetters = 0;
let hintCount = 0;
const maxGuesses = 10;
let currentUser = null;
let gameCount = 0;

const wordDisplayElement = document.getElementById('word-display');
const guessesElement = document.getElementById('guesses');
const wrongLettersElement = document.getElementById('wrong-letters');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const messageElement = document.getElementById('message');
const newGameButton = document.getElementById('new-game-button');
const hangmanParts = document.querySelectorAll('.hangman-part');
const showExplanationButton = document.getElementById('show-explanation');
const wordExplanationElement = document.getElementById('word-explanation');
const joinRankingButton = document.getElementById('join-ranking');
const signupModal = document.getElementById('signup-modal');
const loginModal = document.getElementById('login-modal');
const joinRankingModal = document.getElementById('join-ranking-modal');
const leaderboardList = document.getElementById('leaderboard-list');

function initGame() {
    const wordKeys = Object.keys(words);
    selectedWord = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    displayedWord = '_'.repeat(selectedWord.length);
    guessedLetters = [];
    wrongLetters = [];
    remainingGuesses = maxGuesses;
    revealedLetters = 0;
    hintCount = 0;
    gameCount++;
    
    updateDisplay();
    resetUI();

    if (gameCount % 3 === 0 && !currentUser) {
        showJoinRankingModal();
    }
}

function resetUI() {
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.value = '';
    messageElement.textContent = '';
    hangmanParts.forEach(part => part.style.display = 'none');
    showExplanationButton.style.display = 'none';
    wordExplanationElement.style.display = 'none';
}

function updateDisplay() {
    wordDisplayElement.textContent = displayedWord.split('').join(' ');
    guessesElement.textContent = `남은 기회: ${remainingGuesses}`;
    wrongLettersElement.textContent = `틀린 글자: ${wrongLetters.join(', ')}`;
    updateHangman();
}

function updateHangman() {
    hangmanParts.forEach((part, index) => {
        part.style.display = index < maxGuesses - remainingGuesses ? 'block' : 'none';
    });
}

function makeGuess() {
    const guess = guessInput.value.toLowerCase();
    if (!isValidGuess(guess)) return;

    if (selectedWord.toLowerCase().includes(guess)) {
        let foundNewLetter = false;
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i].toLowerCase() === guess && displayedWord[i] === '_') {
                displayedWord = displayedWord.substr(0, i) + selectedWord[i] + displayedWord.substr(i + 1);
                foundNewLetter = true;
            }
        }
        if (foundNewLetter) {
            messageElement.textContent = '정답입니다!';
        } else {
            messageElement.textContent = '이미 맞춘 글자입니다.';
        }
    } else {
        wrongLetters.push(guess);
        remainingGuesses--;
        hintCount++;
        messageElement.textContent = '틀렸습니다!';
        
        if (hintCount % 3 === 0) {
            revealNextLetter();
        }
    }
    
    guessedLetters.push(guess);
    updateDisplay();
    checkGameStatus();
    guessInput.value = '';
}

function isValidGuess(guess) {
    if (guess.length !== 1) {
        messageElement.textContent = '한 글자만 입력해주세요.';
        return false;
    }
    if (guessedLetters.includes(guess) || wrongLetters.includes(guess)) {
        messageElement.textContent = '이미 추측한 글자입니다.';
        return false;
    }
    return true;
}

function revealNextLetter() {
    if (revealedLetters < selectedWord.length) {
        displayedWord = selectedWord.slice(0, revealedLetters + 1) + 
                        displayedWord.slice(revealedLetters + 1);
        revealedLetters++;
        updateDisplay();
    }
}

function checkGameStatus() {
    if (displayedWord === selectedWord) {
        endGame('승리');
    } else if (remainingGuesses === 0) {
        endGame('패배');
    }
}

function endGame(result) {
    guessInput.disabled = true;
    guessButton.disabled = true;
    if (result === '승리') {
        messageElement.textContent = '축하합니다! 단어를 맞추셨습니다!';
        if (currentUser) {
            addToLeaderboard(currentUser, remainingGuesses);
        }
    } else {
        messageElement.textContent = `게임 오버! 정답은 "${selectedWord}"입니다.`;
    }
    showExplanationButton.style.display = 'inline-block';
}

function showExplanation() {
    wordExplanationElement.textContent = words[selectedWord];
    wordExplanationElement.style.display = 'block';
}

function showSignupModal() {
    signupModal.style.display = 'block';
}

function showLoginModal() {
    loginModal.style.display = 'block';
}

function showJoinRankingModal() {
    joinRankingModal.style.display = 'block';
}

function closeModals() {
    signupModal.style.display = 'none';
    loginModal.style.display = 'none';
    joinRankingModal.style.display = 'none';
}

function signup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    if (password !== passwordConfirm) {
        showError('비밀번호가 일치하지 않습니다.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email
            });
        })
        .then(() => {
            currentUser = { name, email };
            closeModals();
            showMessage('회원가입이 완료되었습니다.');
            updateUIForUser();
        })
        .catch((error) => {
            console.error('Signup error:', error);
            showError('회원가입 중 오류가 발생했습니다: ' + error.message);
        });
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return getDoc(doc(db, 'users', user.uid));
        })
        .then((docSnap) => {
            if (docSnap.exists()) {
                currentUser = { name: docSnap.data().name, email: docSnap.data().email };
                closeModals();
                showMessage('로그인되었습니다.');
                updateUIForUser();
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
            showError('로그인 중 오류가 발생했습니다: ' + error.message);
        });
}

function logout() {
    signOut(auth).then(() => {
        currentUser = null;
        updateUIForUser();
        showMessage('로그아웃되었습니다.');
    }).catch((error) => {
        console.error('Logout error:', error);
        showError('로그아웃 중 오류가 발생했습니다.');
    });
}

function updateUIForUser() {
    if (currentUser) {
        joinRankingButton.textContent = '로그아웃';
        joinRankingButton.removeEventListener('click', showSignupModal);
        joinRankingButton.addEventListener('click', logout);
    } else {
        joinRankingButton.textContent = '로그인 하고 랭킹전 참여하기';
        joinRankingButton.removeEventListener('click', logout);
        joinRankingButton.addEventListener('click', showSignupModal);
    }
}

function addToLeaderboard(user, score) {
    addDoc(collection(db, 'leaderboard'), {
        name: user.name,
        score: score,
        timestamp: serverTimestamp()
    })
    .then(() => {
        console.log("Leaderboard updated successfully");
        updateLeaderboard();
    })
    .catch((error) => {
        console.error("Error updating leaderboard: ", error);
        showError("랭킹 업데이트 중 오류가 발생했습니다.");
    });
}

function updateLeaderboard() {
    const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
    getDocs(leaderboardQuery)
        .then((querySnapshot) => {
            leaderboardList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const li = document.createElement('li');
                li.textContent = `${data.name}: ${data.score}`;
                leaderboardList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error("Error fetching leaderboard: ", error);
            showError("랭킹 정보를 가져오는 중 오류가 발생했습니다.");
        });
}

function showError(message) {
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

function showMessage(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    guessButton.addEventListener('click', makeGuess);
    newGameButton.addEventListener('click', initGame);
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
    showExplanationButton.addEventListener('click', showExplanation);
    joinRankingButton.addEventListener('click', showSignupModal);
    document.getElementById('signup-form').addEventListener('submit', signup);
    document.getElementById('login-form').addEventListener('submit', login);
    document.getElementById('join-ranking-yes').addEventListener('click', function() {
        closeModals();
        showSignupModal();
    });
    document.getElementById('join-ranking-no').addEventListener('click', closeModals);

    // 모달 닫기 버튼 이벤트 리스너
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModals();
        });
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // 초기 게임 시작 및 리더보드 업데이트
    initGame();
    updateLeaderboard();
});

// 인증 상태 변경 감지
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
            if (docSnap.exists()) {
                currentUser = { name: docSnap.data().name, email: user.email };
                updateUIForUser();
            }
        });
    } else {
        currentUser = null;
        updateUIForUser();
    }
});