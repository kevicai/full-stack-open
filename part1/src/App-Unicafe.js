import { useState } from 'react';

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
        <h1>Give feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />

        <h1>Statistics</h1>
        {good !==0 || neutral !== 0 || bad !== 0 ?
         <Statistics good={good} neutral={neutral} bad={bad}/> : <h3>No feedback given</h3>}
    </div>
  );
}

const Statistics = ({good, bad, neutral}) => {
    const all = good + neutral + bad;
    const average = (good - bad) / all;
    const positive = (good / all) * 100;

    return (
        <div>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive + " %"} />
        </div>
    );
}

const StatisticLine = ({ text, value }) => (
    <tr>
      <td>{text}</td>
      <td style={ {paddingLeft:"10px"} }>{value}</td>
    </tr>
);

const Button = (props) => (
    <button onClick={props.handleClick}>
        {props.text}
    </button>
);

export default App;