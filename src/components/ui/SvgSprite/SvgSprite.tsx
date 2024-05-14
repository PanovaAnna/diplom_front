import {FC} from "react";
import sprite from "@/components/assets/sprite.svg"

interface Props {
    id : string
    width : number
    height : number
    classname? : string
}

const SvgSprite : FC<Props> = ({id, width, height, classname}) => {
    return (
        <svg className={classname || ""} width={height + "px"} height={width + "px"}>
            <use xlinkHref={sprite+"#"+id}/>
        </svg>
    );
};

export {SvgSprite};