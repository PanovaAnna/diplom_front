import {FC, useEffect} from "react";
import "./Range.scss"

interface Props {
    input : string,
    setInput : Function,
    bonuses : number
}

const Range : FC<Props> = ({input, setInput,bonuses}) => {


    useEffect(() => {
        const rangeThumb = document.getElementById("range-thumb") as HTMLElement
        const rangeNumber = document.getElementById("range-number") as HTMLElement
        const rangeLine = document.getElementById("range-line") as HTMLElement
        const rangeInput = document.getElementById("slider") as HTMLInputElement

        const updateRangeValue = () => {
            rangeNumber.textContent = rangeInput.value;
        };

        const updateRangeVisuals = () => {
            const thumbPosition = +rangeInput.value / +rangeInput.max;
            const space = rangeInput.offsetWidth - rangeThumb.offsetWidth;

            rangeThumb.style.left = thumbPosition * space + "px";

            rangeLine.style.width = +rangeInput.value / bonuses * 100  + "%";
        };

        rangeInput.addEventListener("input", () => {
            updateRangeValue();
            updateRangeVisuals();
        });

        const initializeRangeSlider = () => {
            updateRangeValue();
            updateRangeVisuals();
        };

        initializeRangeSlider();
    }, [bonuses])

    return (
        <div className="range">
            <div className="range__content">
                <div className="range__slider">
                    <div className="range__slider-line" id="range-line"></div>
                </div>

                <div className="range__thumb" id="range-thumb">
                    <div className="range__value">
                        <span className="range__value-number" id="range-number">0</span>
                    </div>
                </div>

                <input type="range" className="range__input" id="slider" min="0" max={bonuses}
                       value={input} onInput={(event) =>  setInput(event.currentTarget.value)} step="1"/>
            </div>
        </div>
    );
};

export {Range};