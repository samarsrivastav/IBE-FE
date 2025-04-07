interface HeadingProps{
    title:string
}
import "./Heading.scss";
export const Heading = ({title}:HeadingProps) =>{
  return (
    <div className="input-container__heading">
       <h1>{title}</h1>
    </div>
  )
}
