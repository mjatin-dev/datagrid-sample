import { useState } from "react";
import { MdClose } from "react-icons/md";
import Text from "../../Text/Text";
import styles from "./styles.module.scss";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";

export default function ExpectedAnswerInput({
  expectedAnswers,
  setExpectedAnswers,
  ...rest
}) {
  const [isError, setIsError] = useState(false);
  const onFinishTyping = (e) => {
    const value = removeWhiteSpaces(e.target.value);
    if (value) {
      let temp = [...(expectedAnswers || [])]?.filter(
        (element) => element !== ""
      );
      if (!temp.includes(value) && value !== " ") {
        temp = [...temp, value];
        setExpectedAnswers(temp);
        e.target.value = "";
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  };
  const removeAnswer = (answer) => {
    let temp = expectedAnswers || [];
    temp = [...temp].filter((element) => element !== answer);
    setExpectedAnswers(temp);
  };
  return (
    <div className={styles.expectedAnswers}>
      <label
        className={styles.expectedAnswersInputLabel}
        htmlFor="expected-answer-input"
      >
        Expected Answers
      </label>

      <input
        type="text"
        className={styles.expectedAnswersInput}
        placeholder="Add answer"
        onKeyDown={(e) => e.key === "Enter" && onFinishTyping(e)}
        onBlur={onFinishTyping}
        id="expected-answer-input"
        {...rest}
      />
      {isError && (
        <Text
          heading="span"
          text={"option exist or empty string is not allowed"}
          variant="error"
        />
      )}
      <div className={styles.expectedAnswersValues}>
        {expectedAnswers &&
          expectedAnswers?.length > 0 &&
          typeof expectedAnswers === "object" &&
          expectedAnswers?.map((element, index) => {
            return (
              <div
                className={styles.expectedAnswersValue}
                onClick={() => {
                  if (!rest.disabled) {
                    removeAnswer(element);
                  }
                }}
                key={`${element}-${index}`}
              >
                <span>{element}</span> <MdClose />
              </div>
            );
          })}
      </div>
    </div>
  );
}
