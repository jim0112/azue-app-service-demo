import './App.css';
import { useState, useEffect } from 'react';
import { Stack, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from './api';
import { useMsal, useIsAuthenticated, AuthenticatedTemplate } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';

const App = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [action, setAction] = useState("");
  const [data, setData] = useState([]);
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [token, setToken] = useState("");

  const dateChange = (e) => {
    setDate(dayjs(e))
  }
  const timeChange = (e) => {
    setTime(dayjs(e))
    console.log(dayjs(e));
  }
  const handleView = async () => {
    const {
      data: { message, data },
    } = await axios.get('/schedule');
    if (message){
      console.log(message);
    }
    if (data){
      console.log(data);
      setData(data);
    }
  }

  const handleInsert = async (date, time, action) => {
    const {
      data: { message },
    } = await axios.post('/insert', {
      date,
      time,
      action,
    });
    if (message){
      console.log(message);
    }
    handleView();
  }
  
  const handleDelete = async () => {
    const {
      data: { message },
    } = await axios.delete('/schedules');
    if (message){
      console.log(message);
    }
    handleView();
  }

  const displayData = () => {
    return (
      <div>
        {data.map((item, index) => {
          return (
            <p className='item'>{`${index + 1}. ${item}`}</p>
          );
        })}
      </div>
    )
  }

  const addToDB = () => {
    const realDate = `${date.$y}/${date.$M + 1}/${date.$D}`
    let realTime = "";
    if(time.$H >= 10 && time.$m >= 10)
      realTime = `${time.$H}:${time.$m}`;
    else if(time.$H < 10 && time.$m >= 10)
      realTime = `0${time.$H}:${time.$m}`;
    else if(time.$H >= 10 && time.$m < 10)
      realTime = `${time.$H}:0${time.$m}`;
    else
      realTime = `0${time.$H}:0${time.$m}`;
    console.log(realDate);
    console.log(realTime);
    console.log(action);
    handleInsert(realDate, realTime, action);
  }

  const retrieveToken = () => {
    if (isAuthenticated && inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: ["api://89cd1b59-829e-414a-b93a-f871d06a9dd6/act_as_user"],
        account: accounts[0],
      };
      console.log("in retrieveToken");
      instance.acquireTokenSilent(accessTokenRequest)
      .then((accessTokenResponse) => {
        let accessToken = accessTokenResponse.accessToken;
        setToken(accessToken);
      })
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance
            .acquireTokenPopup(accessTokenRequest)
            .then(function (accessTokenResponse) {
              // Acquire token interactive success
              let accessToken = accessTokenResponse.accessToken;
              console.log(accessToken);
              setToken(accessToken);
            })
            .catch(function (error) {
              // Acquire token interactive failure
              console.log(error);
            });
        }
      });
    }
    else{
      console.log("not authenticated");
    }
  }
  useEffect(() => {
    if (token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(axios.defaults.headers);
    }
  }, [token])
  return (
    <>
    <div className='header'>
      {isAuthenticated ? <span>歡迎回來 {accounts[0].name}</span> : <span>請先登入</span>}
      {accounts.length === 0 && <Button variant='filled' className='login' onClick={() => instance.loginPopup()}>登入</Button>}
      {accounts.length > 0 && <Button variant='filled' className='logout' onClick={() => instance.logout()}>登出</Button>}
    </div>
    <div className='main'>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        className='input'
      >
        <Stack spacing={2}>
          <DatePicker
            openTo="year"
            views={['year', 'month', 'day']}
            label="請選擇日期"
            value={date}
            onChange={e => {
              dateChange(e);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
          <TimePicker
            label="請選擇時間"
            value={time}
            onChange={e => {
              timeChange(e);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            label="請輸入代辦事項"
            color="secondary"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            variant="outlined"
          />
        </Stack>
        {isAuthenticated && <Button className='Button1' variant='filled' onClick={() => addToDB()}>加入行事曆</Button>}
      </LocalizationProvider>
      {isAuthenticated && <Button className="Button2" variant='filled' onClick={() => handleView()}>看行程</Button>}
      {isAuthenticated && <Button className="Button3" variant='filled' onClick={() => handleDelete()}>刪除所有行程</Button>}
    </div>
    <div>
      {isAuthenticated ? data.length > 0 ? displayData() : <p className='item'>目前無行程</p> : ""}
    </div>
    {isAuthenticated && <Button onClick={() => retrieveToken()}>get Token</Button>}
    </>
  );
}

export default App;
