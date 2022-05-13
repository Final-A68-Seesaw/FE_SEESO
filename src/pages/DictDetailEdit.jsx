import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  __loadDictDetail,
  __addDictComment,
} from "../redux/modules/dictionary";

//element & component
import Header from "../components/Header";
import {
  bold12,
  bold15,
  bold17,
  bold30,
  med14,
  med15,
} from "../themes/textStyle";
import { CommentTextarea } from "../elements/Textarea";
import Character from "../components/Character";

//style
import styled from "styled-components";
import Line from "../asset/Dictionary_detail_line.svg";
import { BsChevronRight } from "react-icons/bs";
import CommentCard from "../components/CommentCard.jsx";

const DictDetail = (props) => {
  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  const params = useParams();
  const dispatch = useDispatch();
  const dataList = useSelector((state) => state.dictionary.detailData);

  useEffect(() => {
    dispatch(__loadDictDetail(params.cardTitleId, 1));
  }, []);

  //이미지 버튼 애니메이션
  const RecentScrollRef = useRef();

  //인풋 글자수 count
  const [inputCount, setInputCount] = useState("0");
  const onInputChange = (e) => {
    setInputCount(e.target.value.length);
  };

  //댓글 데이터 전송
  const onSubmit = (data) => {
    dispatch(__addDictComment(params.cardTitleId, data));
  };

  return (
    <>
      <Header />
      <Container>
        <GenerationBox>{dataList && dataList.generation} </GenerationBox>
        <TitleBox>{dataList && dataList.title}</TitleBox>

        <UserInfoBox>
          <Character char={dataList && dataList.profileImages} />
          <CharacterAlign>
          <UserName>{dataList && dataList.lastNickname}</UserName>
          <UpdateBox>{dataList && dataList.postUpdateTime} </UpdateBox>
          <WordInfo>
            | 조회수 {dataList && dataList.views} | 스크랩{" "}
            {dataList && dataList.scrapCount}
          </WordInfo>
          </CharacterAlign>
        </UserInfoBox>

        <ContentsBox>{dataList && dataList.contents} </ContentsBox>

        <>
          {dataList && dataList.postImages.length !== 0 ? (
            <>
              <ImageArea>
                <Images>
                  {dataList.postImages.map((v, i) => {
                    return (
                      <div key={i}>
                        <Image src={v} />
                      </div>
                    );
                  })}
                  <div ref={RecentScrollRef}></div>
                  <BsChevronRight
                    onClick={() => {
                      RecentScrollRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "end",
                      });
                    }}
                    style={{
                      fontSize: "30px",
                      cursor: "pointer",
                      position: "absolute",
                      top: "700px",
                      right: "250px",
                    }}
                  />
                </Images>
              </ImageArea>
              <HrLine />
            </>
          ) : null}
        </>

        {dataList && dataList.videoUrl === null ? null : (
          <>
            <LabelTag>
              참고 영상 URL |
              <VideoUrlTag href={dataList && dataList.videoUrl}>
                {dataList && dataList.videoUrl}
              </VideoUrlTag>
            </LabelTag>

            <hr style={{ border: "1px solid var(--graydf)" }} />
          </>
        )}

        {dataList && dataList.tagName.length !== 0 ? (
          <>
            <LabelTag>태그</LabelTag>
            <TagArea>
              <Tags>
                {dataList.tagName.map((v, i) => {
                  return (
                    <div key={i}>
                      <Tag> # {v}</Tag>
                    </div>
                  );
                })}
              </Tags>
            </TagArea>
            <hr style={{ border: "1px solid var(--graydf)" }} />
          </>
        ) : null}

        <CommentBox>
          <CommentBoldText>
            {" "}
            신조어의 예문에 대한 댓글을 달아주세요!
          </CommentBoldText>
          <CommentText>
            비방글 혹은 내용과 상관없는 댓글을 작성할 시 삭제될 수 있음을 미리
            알려드립니다.
          </CommentText>
        </CommentBox>

        <WordUseExample>
          <p>신조어 사용 예문 {dataList && dataList.commentCount}</p>
        </WordUseExample>
        <Line />
        <CommentInputBox>
          <CommentUserName>{dataList && dataList.nickname}</CommentUserName>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CommentTextarea
              ref={register}
              name="comment"
              type="text"
              onChange={onInputChange}
              maxLength="500"
              placeholder="주제와 무관한 댓글, 홍보, 욕설, 일방적인 비난이나 악플 등은 삭제될 수 있습니다."
            />
            <InputCountBox>{inputCount}/500</InputCountBox>
            <div style={{ display: "flex", justifyContent: "top" }}>
              <CommentHr width="90%" />
              <CommentSubmitBtn type="submit">등록</CommentSubmitBtn>
            </div>
          </form>
        </CommentInputBox>
       <CommentCard data = {dataList && dataList.postComments[0]}/>
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: auto;
  max-width: 46rem;
`;

const GenerationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 2rem;
  background-color: var(--black);
  border-radius: 40px;
  color: white;
  ${bold12}
  margin-top: 5rem;
  margin-bottom: 0.5rem;
`;
const CharacterAlign = styled.div`
display:flex;
align-items: center;
margin-top: 1rem;
margin-bottom: 1rem;

`;
const TitleBox = styled.div`
  ${bold30}
  margin-bottom: 1.5rem;
`;
const UserInfoBox = styled.div`
display: flex;
  margin: 1rem 0;
`;
const UserName = styled.div`
  ${bold15}
  margin-left: 2.5rem;
`;
const UpdateBox = styled.div`
  margin-left: 0.5rem;
`;
const WordInfo = styled.div`
  color: var(--gray99);
  margin: 0 0.5rem 0 0.5rem;
`;

const ContentsBox = styled.div`
  margin: 1rem 0 0 0;
  width: 95%;
  height: 14rem;
  border: 1.5px solid var(--graydf);
  border-radius: 3px;
  padding: 1rem;
`;

const HrLine = styled.hr`
  border: 1px solid var(--graydf);
`;

const ImageArea = styled.div`
  margin: 2rem 0 1rem 0;

  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Images = styled.div`
  display: flex;
  flex-direction: row;
`;
const Image = styled.img`
  width: 12rem;
  height: 12rem;
  border-radius: 7px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 0.5rem 0 0;
`;
const LabelTag = styled.div`
  ${med14}
  color: var(--gray66);
  margin: 1rem 0 1rem 0;
`;

const VideoUrlTag = styled.a`
  ${med14}
  margin-left : 8px;
  text-decoration-line: none;
`;

const TagArea = styled.div`
  margin: 0 0 1rem 0;
  justify-content: flex-start;
`;

const Tags = styled.div`
  display: flex;
  flex-direction: row;
`;

const Tag = styled.div`
  ${med15}
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 0;
  padding: 7px;
  background-color: var(--white);
  border-radius: 22px;
  border: 1.5px solid var(--gray99);
  color: var(--gray99);
`;

const CommentBox = styled.div`
  width: 44rem;
  background-color: #f5f7ff;
  border-radius: 3px;
  padding: 1rem;
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 3rem;
`;
const CommentBoldText = styled.div`
  ${bold17}
  color: var(--black);
  margin-bottom: 1rem;
`;
const CommentText = styled.div`
  ${med14}
  color: var(--red);
`;
const WordUseExample = styled.div`
  ${bold17}
  color:var(--purple);
  margin: 0 0 0 8px;
`;

const CommentInputBox = styled.div`
  width: 100%;
  color: var(--gray99);
  border: 0.75px solid var(--gray99);
  border-radius: 3px;
  margin: 2rem 0 2rem 0;
`;
const CommentUserName = styled.div`
  ${bold15}
  color: black;
  margin: 1rem 0 0 1rem;
`;
const CommentSubmitBtn = styled.button`
  background-color: var(--red);
  color: var(--white);
  width: 5rem;
  height: 3rem;
  display: right;
  border: transparent;
  border-radius: 3px;
  ${med15}
`;
const CommentHr = styled.div`
  border: 1px solid var(--graydf);
  width: 43rem;
`;

const InputCountBox = styled.div`
  display: flex;
  justify-content: flex-end;
  color: var(--gray99);
  ${med14}
  margin: 0 1rem 1rem 0;
`;


export default DictDetail;