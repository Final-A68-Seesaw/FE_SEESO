import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Header from '../components/Header'
import { bold41 } from '../themes/textStyle'
import GameBgPng from '../asset/GameBg.png'
import GameInput1 from '../asset/GameInputBg1.svg'
import CWword from '../components/CWword'
import { MainApi } from '../api/mainApi'
import GameOVerDiv from '../asset/GameOverdiv.svg'

const CrossWord = () => {

    const inputRef = useRef()

    //유저가 풀기위해 선택한 문제
    const [selQuiz, setSelQuiz] = useState()
    //유저가 문제푸는 인풋창
    const [writeAnswer, setWriteAnswer] = useState('')
    //틀렸을때 틀렸다는메세지 띄우기위해 체크하는 변수
    const [answerCheck, setAnswerCheck] = useState(true)
    //문제 맞춘개수
    const [pass, setPass] = useState(0)
    //포기했는지 체크하는 변수
    const [giveup, setGiveup] = useState(false)
    //게임이 끝난상태인지 체크하는 변수
    const [gameover, setGameover] = useState(false)

    //게임 데이터 담는 변수
    const [crData, setCrData] = useState([])
    //게임을 불러왔는지 체크하는 변수
    const [loaderr, setLoaderr] = useState(false)

    //문제 선택했을때 실행되는 함수
    const SelWord = (data) => {
        if (data.pass || giveup)
            return

        setSelQuiz(data)
        setWriteAnswer('')
        setAnswerCheck(true)
        inputRef.current.focus()
    }

    //문제 단어단위의 네모박스
    const SettingLine = (data, ikey) => {
        return <CellContainer key={ikey}>
            <CWword
                data={data}
                datakey={selQuiz?.id}
                IsOver={gameover || giveup}
                onClick={() => SelWord(data)} />
        </CellContainer>
    }

    //시작 네모박스 100개 찍어주는 함수
    const SettingData = () => {
        let gameMap = []

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                gameMap.push(<Cell key={i * 10 + j} />)
            }
        }

        return <CellContainer>{gameMap}</CellContainer>
    }

    const onkeydown = (e) => {
        if (e.nativeEvent.isComposing) { return; }

        if (e.key === 'Enter')
            CheckAnswer()
    }

    //문제가 안보여요 버튼
    //문제를 선택할수 없을때 포커스 맞춰주는 함수
    const NoSee = () => {
        for (let i = 0; i < crData.length; i++) {
            if (!crData[i].pass)
                return SelWord(crData[i])
        }
    }

    //문제를 다 맞췄는지 체크하는 함수
    const AllCheck = () => {
        for (let i = 0; i < crData.length; i++) {
            if (!crData[i].pass)
                return false
        }
        return true
    }

    //포기할래요 눌렀을때 실행되는 함수
    const GameGiveUp = () => {
        setGiveup(true)
        setGameover(true)
    }

    //문제를 풀고 답을 확인하기 위한 함수
    const CheckAnswer = () => {
        if (!selQuiz)
            return

        if (selQuiz.word === writeAnswer) {
            let test = (crData.findIndex((v, i) => selQuiz.id === v.id))
            crData[test].pass = true
            setAnswerCheck(true)
            setPass(pass + 1)
            setSelQuiz()
            if (AllCheck()) {
                setGameover(true);
            }
        }
        else {
            setAnswerCheck(false)
        }

        setWriteAnswer('')
    }

    useEffect(() => {
        //게임 전체 데이터 받아오기
        MainApi.crossgame()
            .then((res) => {
                setCrData(res.data)
            })
            //데이터 못받아왔을때 GameReload() 함수를 실행 -> setTimeout으로 1초뒤에 실행
            .catch((err) => {
                if (err.response.data.status === 500) {
                    setLoaderr(true)
                    setTimeout(() => {
                        GameReload()
                    }, 1000)
                }
            })
    }, [])

    //게임 데이터를 못받아왔을때 실행하는 함수
    const GameReload = () => {
        MainApi.crossgame()
            .then((res) => {
                setCrData(res.data)
                setLoaderr(false)
            })
            //데이터 못받아왔을때 GameReload() 함수를 재실행 -> setTimeout으로 1초마다 실행
            .catch((err) => {
                if (err.response.data.status === 500) {
                    setLoaderr(true)
                    setTimeout(() => {
                        GameReload()
                    }, 1000)
                }
            })
    }


    return (
        <div>
            <Header />
            <GameContainer>
                <img src={GameBgPng} style={{ position: 'absolute', width: '-webkit-fill-available', minHeight: '755px', height: '100vh', overflow: 'hidden', top: '0px' }} />

                {SettingData()}
                {crData?.map((v, i) => {
                    return SettingLine(v, i)
                })}

                <QuestContainer>
                    <QuestDiv>
                        {/* 오른쪽 검정배경화면 */}
                        <GameInput1 style={{ position: 'absolute', right: '0px' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', width: '594px', minHeight: '755px', height: '100vh', right: '0px', background: '#111111' }}>
                            {gameover ? null : <>
                                <div style={{ display: 'flex', width: '494px', height: '23px', margin: '127px auto 0 auto', justifyContent: 'space-between' }}>
                                    <Questlabel>단어 설명</Questlabel>
                                    <QuestCnt>남은단어 : {crData.length - pass}</QuestCnt>
                                </div>
                                <Questdesc>{loaderr ? `에러 ! 다시 불러오는중...` : selQuiz ? selQuiz.contents : `맞출 칸을 선택해 주세요`}</Questdesc>
                                <AnswerDiv>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <AnswerInput
                                            ref={inputRef}
                                            value={writeAnswer}
                                            onChange={(e) => setWriteAnswer(e.target.value)}
                                            onKeyDown={(e) => onkeydown(e)}
                                        />
                                        <AnswerWrong>{!answerCheck ? <WrongMsg>{`다시한번 생각해보세요!`}</WrongMsg> : null}</AnswerWrong>
                                    </div>
                                </AnswerDiv>

                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', alignItems: 'center', zIndex: '4' }}>
                                    <CheckBtn margin='0' onClick={CheckAnswer}>확인</CheckBtn>
                                    <NoSeeBtn style={{ marginTop: '30px' }} onClick={NoSee}>문제가 안 보여요 !</NoSeeBtn>
                                    <GameOver style={{ marginTop: '30px' }} onClick={GameGiveUp}><u>포기할래요</u></GameOver>
                                </div>
                            </>
                            }

                            {gameover ? <GameOverWrap>
                                <div style={{ margin: '127px auto 0 auto' }}>
                                    <GameoverMsg className='bounce-in-top'>{crData.length - pass === 0 ? `훌륭해요!` : `수고하셨어요`}</GameoverMsg>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <GameOVerDiv style={{ position: 'absolute', bottom: '0px' }} />
                                    <div className='slit-in-horizontal' style={{ position: 'absolute', bottom: '138px', display: 'flex', justifyContent: 'center' }}>
                                        <PassMiss>
                                            <OverMsg><p>맞힌 단어 수</p><p>{pass}개</p></OverMsg>
                                            <OverMsg style={{ color: crData.length - pass === 0 ? '#FFC438' : '#FF4E4E' }}><p>미완료 단어 수</p><p>{crData.length - pass}개</p></OverMsg>
                                        </PassMiss>
                                        <ReplayBtn onClick={() => window.location.reload()}>{crData.length - pass === 0 ? `한번더!` : `다시 도전!`}</ReplayBtn>
                                    </div>
                                </div>
                            </GameOverWrap>
                                : null}

                        </div>
                    </QuestDiv>
                </QuestContainer>
            </GameContainer>
        </div>
    )
}

export default CrossWord

const GameContainer = styled.div`
    display: flex;
`

const CellContainer = styled.div`
    position: absolute;
    min-width: 630px;
    width: 630px;
    height: 534.6px;
    gap: 8.61px;
    margin: 127px 126px 0 126px;

    display: flex;
    flex-wrap: wrap;
`

const Cell = styled.div`
    width: 51.65px;
    height: 51.65px;

    border: 1.5px solid #FFFFFF;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4.30434px;
    transform: matrix(0, -1, -1, 0, 0, 0);
`

const QuestContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 50;
`

const AnswerDiv = styled.div`
    display: flex;
    margin: 0 auto;
`

const AnswerInput = styled.input`
    ${bold41}
    width: 270px;
    height: 60px;
    padding: 0 10px;

    border: 1.5px solid #FFFFFF;
    border-radius: 5px;
    background: #111111;

    /* 35pt_Bold */
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 35px;
    line-height: 51px;
    /* identical to box height */

    display: flex;
    align-items: center;

    color: #FFFFFF;
`

const AnswerWrong = styled.div`

    height: 20px;
    margin: 12px auto 0 auto;
    z-index: 4;

`

const WrongMsg = styled.p`
    animation: shake-horizontal 0.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) ;

    @keyframes shake-horizontal {
        0%,
        100% { transform: translateX(0); }
        10%, 30%, 50%,
        70% { transform: translateX(-10px); }
        20%, 40%,
        60% { transform: translateX(10px); }
        80% { transform: translateX(8px); }
        90% { transform: translateX(-8px); }
    }

    /* 14pt_Medium */

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;

    /* primary_red_#FF4E4E */

    color: #FF4E4E;
`

const QuestDiv = styled.div`

`

const Questlabel = styled.div`
    
    width: 63px;
    height: 23px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 23px;
    display: flex;
    align-items: center;
    text-align: center;

    color: #FFFFFF;
`

const QuestCnt = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 23px;
    display: flex;
    align-items: center;
    text-align: right;

    /* Secondary_yellow_#FFC438 */

    color: #FFC438;
`

const Questdesc = styled.div`
    box-sizing: border-box;

    width: 494px;
    min-height: 228px;
    margin: 14px auto 48px auto;
    display: flex;
    padding: 30px 26px;

    background: #333333;
    border: 1px solid #555555;
    backdrop-filter: blur(15px);

    border-radius: 5px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 35px;
    letter-spacing: -0.05em;

    color: #FFFFFF;
`

const CheckBtn = styled.div`
    width: 212px;
    height: 52px;

    background: #9851FF;
    border-radius: 56.9524px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    color: #FFFFFF;

    cursor: pointer;

    :hover {
        background: #444444;
        transition: ease-in-out 0.5s;
    }
`

const NoSeeBtn = styled.div`
    width: 212px;
    height: 52px;

    background: #ff7878;
    border-radius: 56.9524px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    color: #FFFFFF;

    cursor: pointer;

    :hover {
        background: #46b5ff;
        transition: ease-in-out 0.5s;
    }
`

const GameOver = styled.p`
    margin: 16px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;

    color: #C0C4C9;

    cursor: pointer;
`

const GameOverWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    .bounce-in-top {
        animation: bounce-in-top 1.1s both;
    }

    @keyframes bounce-in-top {
        0% {
            transform: translateY(-500px);
            animation-timing-function: ease-in;
            opacity: 0;
        }
        38% {
            transform: translateY(0);
            animation-timing-function: ease-out;
            opacity: 1;
        }
        55% {
            transform: translateY(-65px);
            animation-timing-function: ease-in;
        }
        72% {
            transform: translateY(0);
            animation-timing-function: ease-out;
        }
        81% {
            transform: translateY(-28px);
            animation-timing-function: ease-in;
        }
        90% {
            transform: translateY(0);
            animation-timing-function: ease-out;
        }
        95% {
            transform: translateY(-8px);
            animation-timing-function: ease-in;
        }
        100% {
            transform: translateY(0);
            animation-timing-function: ease-out;
        }
    }

    .slit-in-horizontal {
        animation: slit-in-horizontal 0.8s ease-out both;
    }

    @keyframes slit-in-horizontal {
        0% {
            transform: translateZ(-800px) rotateX(90deg);
            opacity: 0;
        }
        54% {
            transform: translateZ(-160px) rotateX(87deg);
            opacity: 1;
        }
        100% {
            transform: translateZ(0) rotateX(0);
        }
    }
`

const GameoverMsg = styled.div`

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 44px;
    line-height: 64px;
    /* identical to box height */

    display: flex;
    align-items: center;
    text-align: center;

    color: #FFFFFF;
`

const PassMiss = styled.div`
    box-sizing: border-box;
    width: 494px;
    height: 150px;
    padding: 30px 26px;
    margin-bottom: 154px;

    background: #333333;
    border: 1px solid #555555;
    backdrop-filter: blur(15px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 5px;
`

const OverMsg = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    /* identical to box height, or 150% */

    letter-spacing: -0.05em;
    
    color: #FFFFFF;
`

const ReplayBtn = styled.div`
    position: absolute;

    width: 212px;
    height: 52px;
    bottom: 0px;
    
    background: #FF4E4E;
    border-radius: 56.9524px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    /* identical to box height */

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    /* White_#ffffff */

    color: #FFFFFF;

    cursor: pointer;
`