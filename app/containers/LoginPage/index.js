import { Button, Spinner, Text, View } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../RootNavigation';
import { getApproveToken, getDriverToken, getToken, login } from '../../api/oauth';
import ToastCustom from '../../components/ToastCustom';
import { DOMAIN_URL, getConfig } from '../../configs/Paths';
import request from '../../utils/request';
import { getData, storeData } from '../../utils/storage';
import Background from './components/Background';
import styles from './styles';

export function LoginPage(props) {
  const [isBusy, setIsBusy] = useState(false);
  const [localData, setLocalData] = useState({})
  const [logo, setLogo] = useState("");
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);

  const [err, setErr] = useState({})
  const [isSecureEntry, setIsSecureEntry] = useState(true)

  useEffect(() => {
    init()
  }, [])


  const init = async () => {
    const domain = await DOMAIN_URL()
    const username = await getData('username')
    setLocalData({
      domain,
      username,
      // domain: 'ievn.lifetek.vn',
      // username: 'maihtn4x',
      // password: '12345678',

      // domain: 'qlkh.ievn.com.vn',
      // username: 'maihtn4x',
      // password: '12345678',

      // domain: 'internal.lifetek.vn',
      // username: 'bachdv@lifetek.vn',
      // password: '12345678',

      // domain: 'stagingerp.lifetek.vn',
      // username: 'admin999',
      // password: '12345678',

      // domain: 'crm.lifetek.vn',
      // username: 'admin3300',
      // password: 'legBHE84',


      // domain: 'maw.lifetek.vn',
      // username: 'admin_maw',
      // password: '12345678',


      // domain: 'quanlytoanha.lifetek.vn',
      // username: 'nhungpth',
      // password: '123456789',
    })
  };

  const handleLogin = async () => {
    console.log('vao day');
    const { domain, username, password } = localData
    try {
      let isValid = {};
      let loginSuccess;
      if (!domain) isValid.domain = true
      if (!username) isValid.username = true
      if (!password) isValid.password = true
      if (!Object.keys(isValid).length) {
        setIsBusy(true);
        const data = {
          username: username.trim(),
          password: password,
          domain,
          grant_type: 'password',
          scope: 'user',
          client_id: 'authServer',
        };
     
        

        const config = await getConfig(domain)
        // thay config.appUrl bằng true


      //   const config ={
      //     domain: "internal.lifetek.vn",
      //     clientId: "2090App",
      //     appUrl: "https://administrator.lifetek.vn:290",
      //     logo: "",
      //     oauthUrl: "https://administrator.lifetek.vn:201",
      //     uploadUrl: "https://administrator.lifetek.vn:203",
      //     approveUrl: "https://administrator.lifetek.vn:202",
      //     dynamicFormUrl: "https://administrator.lifetek.vn:209",
      //     signInUrl: "https://g.lifetek.vn:220/ren/form/61c6db151395724d5f472a30",
      //     config: {
      //         urlDB: "mongodb://langht:12345678@192.168.0.123:27017/2090App",
      //         imageAI: "http://192.168.0.11:8080"
      //     }
      // }  // tu fake config
        console.log('config', config)
        if (config.appUrl) {
          const isLogin = await login(data)
          console.log(111111111, isLogin)
          if (isLogin) {
            console.log('day neay')
            const result = await Promise.all([
              getToken(),
              getApproveToken(),
              getDriverToken(),
            ])
            console.log(result, "token");
            if (result.length === result.filter(e => e).length) {
              await storeData('username', data.username)
              navigate('LoadingScreen')
              loginSuccess = true
            }
          }
        }
        if (!loginSuccess) ToastCustom({ text: 'Đăng nhập thất bại', type: 'danger' })
      } else setErr(isValid)
    } catch (error) {
      console.log('error', error)
    }
    setIsBusy(false);
  }
  const onChange = async (key, val) => {
    setLocalData(e => ({ ...e, [key]: val }))
    err[key] && setErr(e => ({ ...e, [key]: false }))
    let regExp = /^[A-Za-z][\w$.]+\.[\w]+\.\w+$/;
    if ((regExp.test(val) && (val.substr(val.length - 3) === '.vn'))) {
      let api = Object.values((await getConfig(val)))[2].concat("/api/system-config");
      const getAPI = async () => {
        try {
          let url = `${await api}`;
          const body = { method: 'GET' };
          const response = await request(url, body);
          setLogo(response && response.logo);
        } catch (err) { 
          console.log(err)
        }
        return {}
      }
      setIsLoadingLogo(true)
      getAPI();
    } else {
      setIsLoadingLogo(false)
    }
  }

  return (
    <View style={styles.content}>
      <Background />
      <KeyboardAvoidingView style={{flex: 1}}>
        <View style={styles.form}>
          {/* bắt đầu input domain */}
          <View style={styles.host}>
            <MaterialIcons
              active
              name="domain"
              type="MaterialIcons"
              style={{padding: 10, color: 'black'}}
            />
            <TextInput
              style={{flex: 1}}
              name="domain"
              placeholder={'Tên miền'}
              value={localData.domain}
              onChangeText={text => onChange('domain', text)}
              disabled={isBusy}
              autoCapitalize="none"
              autoFocus={true}
              returnKeyType="next"
            />
          </View>
          {/* bắt đầu input đăng nhập */}
          <View rounded last style={styles.input} disabled={isBusy}>
            <Icon active name="user" style={{padding: 10, color: 'black'}} />
            <TextInput
              placeholder={'Tên đăng nhập'}
              name="username"
              value={localData.username}
              onChangeText={text => onChange('username', text)}
              disabled={isBusy}
              autoCapitalize="none"
              style={{flex: 1}}
              returnKeyType="next"
            />
          </View>
          {/* bắt đầu input mật khẩu */}
          <View rounded last style={styles.input} disabled={isBusy}>
            <MaterialIcons
              active
              name="vpn-key"
              style={{padding: 10, color: 'black'}}
            />
            <TextInput
              placeholder={'Mật khẩu'}
              name="password"
              value={localData.password}
              secureTextEntry={isSecureEntry}
              onChangeText={text => onChange('password', text)}
              disabled={isBusy}
              autoCapitalize="none"
              style={{flex: 1}}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
              }}
              onPress={() => {
                setIsSecureEntry(prev => !prev);
              }}>
              <Icon active name="eye" color="black"></Icon>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Button
              block
              rounded
              dark
              style={styles.loginBtn}
              disabled={isBusy}
              onPress={handleLogin}>
              {isBusy && <Spinner color="gray" />}
              {!isBusy ? (
                <Text style={styles.loginBtnText}>Đăng nhập</Text>
              ) : null}
            </Button>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoginPage);
