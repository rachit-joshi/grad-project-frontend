import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Button} from 'react-bootstrap'

const FocusedWordInfo = ({focusedWord, baseComparisonModel, dataset, handleWordReveal}) => {

    React.useEffect(() => {
        console.log(focusedWord)
    },[focusedWord, baseComparisonModel])

    return (
        <>
            {!!focusedWord &&  (
                <div className="wordInformation">
                    Word: <span className="displayInformation">"{dataset.modelData[dataset.models[baseComparisonModel]][focusedWord.wordIdx].word}" </span> in <span className="displayInformation">{dataset.models[baseComparisonModel]}</span>&#160;
                    &#38; similarity with {Object.entries(focusedWord.wordData).map((value, key) => {
                        if(!(value[0] === "color") && !(value[0] === "wordIdx")){
                            return(
                                <>
                                    <span className="displayInformation">{value[0]} : {value[1]}%&#160; </span>
                                </>
                            )

                        }
                    }
                    )}
                    <Button onClick={handleWordReveal}><FontAwesomeIcon icon="externalLinkSquare" /></Button>
                </div>
            )}
        </>
    )



}

export default FocusedWordInfo