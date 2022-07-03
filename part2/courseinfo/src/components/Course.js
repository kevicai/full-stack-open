export default function Course ({course}) {
    return (
      <div>
        <Header name={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }
  
  const Header = (props) => {
    return(
      <h2>{props.name}</h2>
    )
  }
  
  const Content = (props) => {
    return(
      <div>
        {props.parts.map( (part) => <Part key={part.id} part={part}/>)}
      </div>
    )
  }
  
  const Part = (props) => {
    return(
      <p>
          {props.part.name} {props.part.exercises}
      </p>
    )
  }
    
  const Total = (props) => {
    var sum = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  
    return (
      <h3>Number of exercises {sum}</h3>
    )
  }