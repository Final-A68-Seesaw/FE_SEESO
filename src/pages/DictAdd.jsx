import React, { useState } from "react";
import { useForm } from "react-hook-form";

//redux
import { __addDict } from "../redux/modules/dictionary";
import { useDispatch, useSelector } from "react-redux";
import { __dictTitle } from "../redux/modules/dictionary";

//element & components
import Header from "../components/Header";
import { bold18, med15, med14, med20 } from "../themes/textStyle";
import { ErrorXInput, SFormError } from "../elements/Input";
import Button from "../elements/Button";
import { BasicTextarea } from "../elements/Textarea";
import { Select } from "../elements/Select";
import FileUpload2 from "../components/FileUpload2";
import Footer from "../components/Footer";

//style
import styled from "styled-components";
import Book from "../asset/Dictionary_add_imo.svg";
import TextIcon from "../asset/DictAddIcon.svg";

const DictAdd = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  //인풋 글자수 count
  const [inputCount, setInputCount] = useState("0");
  const [title, setTitle] = useState("");
  const onInputChange = (e) => {
    setInputCount(e.target.value.length);
    setTitle(e.target.value);
  };

  //title 중복검사
  const dispatch = useDispatch();

  const realtitle = { title };
  const onTitleChange = (e) => {
    dispatch(__dictTitle(realtitle.title));
  };

  //단어 사용 세대
  const GenerationOptions = [
    { value: "none", label: "선택하세요" },
    { value: "X세대", label: "X세대(1965년 ~ 1979년)" },
    { value: "Y세대", label: "Y세대(1980년 ~ 1994년)" },
    { value: "Z세대", label: "Z세대(1995년 ~ 2005년)" },
    { value: "알파세대", label: "알파세대(2006년~)" }
  ]

  //태그
  const [tagItem, setTagItem] = useState("");
  const [tagList, setTagList] = useState([]);

  //엔터키 프레스시 태그 추가됨
  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };

  //엔터키 프레스 후 태그의 내용이 중복되면 얼럿이 뜨고 없으면 추가된 후 태그 인풋이 리셋됨
  const submitTagItem = () => {
    const tag = tagItem.replace(/^\s+|\s+$/g, '')

    if (!tagList.find((v) => v === tag) && tagList.length < 10) {
      let updatedTagList = [...tagList];
      updatedTagList.push(tag);
      setTagList(updatedTagList);
    }
    setTagItem("");
  };

  //태그 삭제시
  const deleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => `#${tagItem}` !== deleteTagItem
    );
    setTagList(filteredTagList);
  };

  //데이터전송
  const images = useSelector((state) => state.image.newimagelist)

  const onSubmit = (data) => {
    let postDto = {
      title: data.title,
      contents: data.contents,
      videoUrl: data.videoUrl,
      tagNames: tagList,
      generation: data.generation,
      files: images,
    };

    dispatch(__addDict(postDto));
  };

  return (
    <>
      <Header />
      <Container>
        <BookContianer>
          <Book />
        </BookContianer>
        <TextContainer>
          회원님이 알고 있는 <b>새로운 신조어</b>를 등재해주세요
        </TextContainer>

        <WhatisNew>
          <WhatBoxText>
            <TextIcon /> 어떤 것이 신조어인가요?
          </WhatBoxText>
          <hr />
          <WhatsmallText>
            {" "}
            신조어는 새로 만든 낱말을 의미하며 신조어 또는 신어는 새로 만들거나
            생겨난 말 또는 새로 귀화한 외래어를 가리킵니다. ‘신조어 사전’에서는
            현재 새로 만들어진 말 뿐만 아니라 과거 유행했던 신조어를 모두
            포함합니다.
          </WhatsmallText>
        </WhatisNew>

        <LabelBox>
          등재할 신조어 <InputCountBox>{inputCount} /50</InputCountBox>
        </LabelBox>

        <TitleInput>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ErrorXInput
              type="text"
              name="title"
              register={register({
                required: {
                  value: true,
                  message: "⚠ 단어를 입력해주세요.",
                },
              })}
              placeholder="단어를 입력해주세요"
              maxLength="50"
              width="37rem"
              onChange={onInputChange}
              error={errors?.title?.message}
            />
          </form>
          <Button shape="smallBlack-B" onClick={onTitleChange}>
            중복확인
          </Button>
        </TitleInput>

        <form onSubmit={handleSubmit(onSubmit)}>
          <BasicTextarea
            ref={register({
              required: {
                value: true,
                message: "⚠ 내용을 입력해주세요",
              },
            })}
            name="contents"
            type="text"
            placeholder="단어를 설명해줄 수 있는 내용을 적어주세요

                *등록시 유의할 점
                - 형식은 자유롭게 작성하되, 누구나 알아볼 수 있도록 정리해주세요.
                - 사전에 등록되는 것인 만큼 신중하게 내용을 작성해주세요.
                - 최대한 정확한 내용을 담도록 노력해주세요."
            hasError={Boolean(errors?.contents?.message)}
          />
          <SFormError>{errors?.contents?.message}</SFormError>

          {/* 첨부파일 */}
          <FileUpload2 />

          <hr style={{ margin: "1rem 0 1rem 0", color: "var(--grayed)" }} />

          <Select
            name="generation"
            register={register({
              required: true,
              validate: (value) => value !== "none",
            })}
            label="단어 사용 세대"
            width="24rem"
            error={errors?.generation?.type}
          >
            {GenerationOptions.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </Select>

          <ErrorXInput
            type="text"
            name="videoUrl"
            label="동영상 링크 첨부"
            register={register}
            placeholder="URL을 입력해주세요!"
          />
        </form>
        <div>
          <LabelBox>
            <TagLabel> 태그 </TagLabel>{" "}
            <TagLabel>{tagList.length} /10</TagLabel>
          </LabelBox>
          <WholeBox>
            {tagList.length === 0 ? null : (
              <div>
                <TagBox>
                  {tagList.map((tagItem, index) => {
                    return (
                      <TagItem key={index}>
                        <Text>#{tagItem}</Text>
                        <TagXButton onClick={deleteTagItem}>X</TagXButton>
                      </TagItem>
                    );
                  })}
                </TagBox>
                <HrLine />
              </div>
            )}

            {tagList.length >= 10 ? (
              <TagMaxText>태그는 10개까지 입력 가능합니다!</TagMaxText>
            ) : (
              <TagInput
                type="text"
                placeholder="Enter 키를 사용해 #태그를 입력해주세요!"
                tabIndex={2}
                onChange={(e) => setTagItem(e.target.value)}
                value={tagItem}
                onKeyPress={onKeyPress}
              />
            )}
          </WholeBox>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button shape="confirmRed-B" type="submit">
              등록하기
            </Button>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default DictAdd;

const Container = styled.div`
  margin: auto;
  max-width: 46rem;
  padding-top: 4rem;
`;

const BookContianer = styled.div`
  text-align: center;
  margin-top: 3.8rem;
`;

const TextContainer = styled.div`
  text-align: center;
  margin-top: 1.3em;
  margin-bottom: 2.5rem;
  ${med20}
  color:var(--black24);
`;

const WhatisNew = styled.div`
  text-align: left;
  padding: 3rem 1.5rem;
  margin-bottom: 2rem;
  background-color: #f5f7ff;
  border-radius: 0.47rem;
`;
const WhatBoxText = styled.div`
  ${bold18}
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;
const WhatsmallText = styled.div`
  ${med15} margin-left: 0.5rem;
  line-height: 24px;
`;
const LabelBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TagLabel = styled.div`
  display: flex;
  justify-content: space-between;
  ${med14}
  margin-top: 8px;
  margin-bottom: 8px;
`;
const HrLine = styled.hr`
 margin : 0.4rem 0.7rem 0 0.7rem;
  border: 0.3px solid var(--graydf);
`;
const TitleInput = styled.div`
  display: flex;
  align-items: center;
`;

const InputCountBox = styled.div`
  ${med14}
  text-align: right;
  margin-right: 7rem;
`;

const WholeBox = styled.div`
  border: 1px solid var(--graydf);
  border-radius: 0.3rem;
  width: 46rem;
  &:focus-within {
    border: 2px solid black;
  }
`;

const TagBox = styled.div`
background-color: transparent;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 3rem;
  padding: 0 10px;
`;

const TagItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 7px;
  background-color: transparent;
  border-radius: 22px;
  border: 1.5px solid var(--purple);
  color: var(--purple);
  font-size: 13px;
`;

const Text = styled.span``;

const TagXButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  background-color: transparent;
  border: transparent;
  color: var(--purple);
  cursor: pointer;
`;

const TagMaxText = styled.div`
  color: var(--grayc1);
  ${med14}
  padding: 0.9rem;
`;
const TagInput = styled.input`
  display: inline-flex;
  min-width: 250px;
  background: transparent;
  border: none;
  outline: none;
  cursor: text;
  padding: 0.9rem;
  &::placeholder {
    color: var(--grayc1);
    ${med14}
  }
`;
