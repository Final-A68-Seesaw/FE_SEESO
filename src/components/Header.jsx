import React, { useState } from 'react'
import styled from 'styled-components'
import { history } from '../redux/configStore'

import { GoSearch } from 'react-icons/go'

import Image from '../elements/Image'
import { InputText } from '../elements/Input'
import Text from '../elements/Text'
import Character from './Character'

import HeaderIcon from '../asset/HeaderIcon.svg'

const Header = (props) => {

    const [showModal, setShowModal] = useState(false)
    const [scrollDown, setScrollDown] = useState(false)

    const openModal = () => {
        setShowModal(!showModal);
    }

    return (
        <Head>
            {/* {showModal ?
                <ModalContainer className='slide-in-left'>
                    <div>메뉴</div>
                </ModalContainer> : null} */}

            <HeadInner>
                <div style={{ display: 'flex' }}>
                    <HeaderIcon />
                    {/* <div style={{ margin: '0 30px', cursor: 'pointer' }} onClick={openModal}>오잉</div> */}

                    <div style={{ display: 'flex', margin: '0 47.5px' }}>
                        <HearderText >사전장</HearderText>
                        <HearderText style={{ margin: '0 28px' }} onClick={() => history.push('/trouble')}>질문장</HearderText>
                        <HearderText onClick={() => history.push('/game')}>게임장</HearderText>
                    </div>
                </div>

                {scrollDown ? <SearchDiv>
                    <SearchInput placeholder='검색어를 입력해주세요' />
                    <GoSearch style={{ margin: '0 0 0 -25px', color: '#FAFAFA' }} />
                </SearchDiv> : null}

                <div style={{ display: 'flex' }}>
                    <WriteDicBtn onClick={()=>history.push('/dictionary/add')}><p>단어 등재하기</p></WriteDicBtn>
                    <ProfileDiv>
                        {/* <Character /> */}
                    </ProfileDiv>
                </div>
            </HeadInner>
        </Head>
    )
}

export default Header

const Head = styled.div`
    position: fixed;
    background: #262626;
    box-shadow: 0px 4px 8px -4px rgba(22, 34, 51, 0.08), 0px 16px 24px rgba(22, 34, 51, 0.08);
    z-index: 100;

    top: 0px;
    height: 74px;
    width: 100%;


    
    .slide-in-left {
        animation: slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @keyframes slide-in-left {
        0% {
            transform: translateX(-1000px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .slide-out-left {
	    animation: slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    }
    
    @keyframes slide-out-left {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-1000px);
            opacity: 0;
        }
    }
`

const HeadInner = styled.div`
    height: 74px;
    padding: 0 128px;

    display: flex;
    align-items: center;
    justify-content: space-between;
`

const HearderText = styled.p`
    width: 53px;
    height: 28px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    font-size: 19px;
    line-height: 28px;

    display: flex;
    align-items: center;
    text-align: center;
    /* margin-right: 30px; */

    cursor: pointer;

    color: #FAFAFA;
`

const ModalContainer = styled.div`
    position: fixed;
    left: 10px;
    top: 110px;
    /* transform: translate(-50%, -50%); */
    max-height: 80%;
    width: 20rem;
    height: 80%;
    padding: 16px;
    background: rgba(200, 200, 200, 0.8);
    border-radius: 10px;
    text-align: center;
    
    
`;

const SearchDiv = styled.div`
    display: flex; 
    align-items: center;
`

const SearchInput = styled.input`
    width: 380px;
    height: 36px;

    background: #494949;
    border-radius: 2px;
    padding: 0px 15px;
    /* margin: 23px 0 15px 0; */

    ::placeholder {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;

        color: #A2A2A2;
    }
`

const WriteDicBtn = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 8px;

    width: 113px;
    height: 36px;

    background: #333333;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;

    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: right;

    color: #EEEEEE;

    flex: none;
    order: 0;
    flex-grow: 0;

    cursor: pointer;
`

const WriteTrouble = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 16px;
    gap: 10px;

    width: 100px;
    height: 36px;

    background: #333333;
    border: 1.5px solid rgba(255, 196, 56, 0.3);
    border-radius: 30px;
`

const ProfileDiv = styled.div`
    display: flex;
    width: 48px;
    height: 30px;
`
