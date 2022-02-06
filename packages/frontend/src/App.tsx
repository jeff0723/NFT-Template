import { Button, Card, Layout, Select, Typography } from 'antd';
import "antd/dist/antd.css";
import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Account from './components/Account';
import { openNotificationWithIcon } from './helpers/notification';
import { useTemplateNFTContract } from './hooks/useContract';
import { useActiveWeb3React } from './hooks/web3';
import { DISCORD_LINK, TWITTER_LINK, MAX_SUPPLY, START_TIME, MINT_PRICE } from './constants'
import styled from 'styled-components';

import logo from './images/logo.png';

import "./style.css";
import WHITELIST from './whitelist/whitelist.json';
const { Option } = Select;

const { Header, Content } = Layout;
const { Text } = Typography
const styles = {
  header: {
    background: 'none',
  },
  contentBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
    minWidth: '375px'
  },
  title: {
    color: '#40a9ff',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#bfbfbf'
  }
}
const IconWrap = styled.a`
    display: inline-block;
    margin: 0 12px;
    height: 24px;
    & svg {
        fill: #000000; 
        &:hover {
            fill: #f2c055;
        }
    }
`

type Voucher = {
  voucher: {
    redeemer: string;
    stageId: number;
    nonce: number;
    amount: number;
  };
  signature: string;
}

type StageInfo = {
  stageId: number;
  maxSupply: number;
  startTime: number;
  endTime: number;
  mintPrice: BigNumber;
}
const whitelist: Map<string, Voucher> = new Map(Object.entries(WHITELIST));


function App() {
  const [mintButtonDisabled, setMintButtonDisabled] = useState(false)
  const [amount, setMintAmount] = useState('1');
  const [stageInfo, setStageInfo] = useState<StageInfo>()
  const { account, chainId } = useActiveWeb3React();
  const [totalSupply, setTotalSupply] = useState(0);
  const templateNFT = useTemplateNFTContract();
  useEffect(() => {
    if (!chainId) return;
    if (chainId !== 1 && chainId !== 1337 && chainId !== 4) {
      openNotificationWithIcon('info', 'Please connect to Ethereum Mainnet', 'Switch your network to Ethereum Mainnet')
      return;
    }
    const getStageInfto = async () => {
      if (!templateNFT) return;
      setStageInfo((await templateNFT?.stageInfo()))
      setTotalSupply((await templateNFT.totalSupply()).toNumber())

    }
    getStageInfto()
  }, [chainId, templateNFT])

  const handleClick = async () => {
    if (!account) {
      openNotificationWithIcon('info', 'Please connect to Wallet', "")
      return;
    }
    if (chainId !== 1 && chainId !== 1337 && chainId !== 4) {
      openNotificationWithIcon('info', 'Please connect to Ethereum Mainnet', 'Switch your network to Ethereum Mainnet')
      return;
    }
    if (!amount) return;

    if (stageInfo?.stageId === 1) {

      const data = whitelist.get(account)
      if (!data) {
        openNotificationWithIcon('info', 'Not in whitelist', '')
        return
      }
      if (stageInfo.startTime * 1000 > Date.now()) {
        openNotificationWithIcon('info', "Sales has'nt started yet", '')
        return
      }
      const voucher = data?.voucher
      const signature = data?.signature

      try {
        setMintButtonDisabled(true)
        const tx = await templateNFT?.whitelistMint(voucher, signature, amount, {
          value: stageInfo?.mintPrice?.mul(amount)
        })
        const receipt = await tx?.wait()
        if (receipt?.status) {
          openNotificationWithIcon('success', 'Mint success!', "Welcome to the templateNFT! You can now check on Opensea.")
          setMintAmount('1')
        }
      } catch (err) {
        setMintButtonDisabled(false)
        // @ts-ignore:next-line
        if (err.code === "INSUFFICIENT_FUNDS") {
          openNotificationWithIcon('error', 'INSUFFICIENT FUND', "You might not have enough fund to perform this opertaion")
          return
        }
        // @ts-ignore:next-line
        if (err.code === 4001) {
          openNotificationWithIcon('error', 'User denied transaction signature', "")
          return
        }
        openNotificationWithIcon('error', 'Error while sending transaction', "")
      }
    } else {
      try {
        setMintButtonDisabled(true)
        const tx = await templateNFT?.publicMint(amount, {
          value: stageInfo?.mintPrice?.mul(amount)
        })
        const receipt = await tx?.wait()
        if (receipt?.status) {
          openNotificationWithIcon('success', 'Mint success!', "Welcome to the templateNFT! You can now check on Opensea.")
          setMintAmount('1')
        }
      } catch (err) {
        setMintButtonDisabled(false)
        // @ts-ignore:next-line
        if (err.code === "INSUFFICIENT_FUNDS") {
          openNotificationWithIcon('error', 'INSUFFICIENT FUND', "You might not have enough fund to perform this opertaion")
          return
        }
        // @ts-ignore:next-line
        if (err.code === 4001) {
          openNotificationWithIcon('error', 'User denied transaction signature', "")
          return
        }
        openNotificationWithIcon('error', 'Error while sending transaction', "")
      }
    }

    setMintButtonDisabled(false)
  }

  const handleChange = (value: any) => {
    console.log(value)
    setMintAmount(value)
  }


  return (
    <Layout>

      {/* // <Layout style={{ background: `url('${background}')` }}> */}
      <Header style={{ ...styles.header, zIndex: 1, width: '100%' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{ padding: '16px' }}>
            {/* <img src={logo} style={{ width: '150px', height: '100px' }} alt='logo' />
             */}
            <Text style={{ fontSize: '3.5vh', fontWeight: 'bold' }}>Blackchain</Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <IconWrap href={TWITTER_LINK} target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M23.643 4.93708C22.808 5.30708 21.911 5.55708 20.968 5.67008C21.941 5.08787 22.669 4.17154 23.016 3.09208C22.1019 3.63507 21.1014 4.01727 20.058 4.22208C19.3564 3.47294 18.4271 2.9764 17.4143 2.80955C16.4016 2.6427 15.3621 2.81487 14.4572 3.29933C13.5524 3.78379 12.8328 4.55344 12.4102 5.48878C11.9875 6.42412 11.8855 7.47283 12.12 8.47208C10.2677 8.37907 8.45564 7.89763 6.80144 7.05898C5.14723 6.22034 3.68785 5.04324 2.51801 3.60408C2.11801 4.29408 1.88801 5.09408 1.88801 5.94608C1.88757 6.71307 2.07644 7.46832 2.43789 8.14481C2.79934 8.8213 3.32217 9.39812 3.96001 9.82408C3.22029 9.80054 2.49688 9.60066 1.85001 9.24108V9.30108C1.84994 10.3768 2.22204 11.4195 2.90319 12.2521C3.58434 13.0847 4.53258 13.656 5.58701 13.8691C4.9008 14.0548 4.18135 14.0821 3.48301 13.9491C3.78051 14.8747 4.36001 15.6841 5.14038 16.264C5.92075 16.8439 6.86293 17.1653 7.83501 17.1831C6.18484 18.4785 4.1469 19.1812 2.04901 19.1781C1.67739 19.1782 1.30609 19.1565 0.937012 19.1131C3.06649 20.4823 5.54535 21.2089 8.07701 21.2061C16.647 21.2061 21.332 14.1081 21.332 7.95208C21.332 7.75208 21.327 7.55008 21.318 7.35008C22.2293 6.69105 23.0159 5.87497 23.641 4.94008L23.643 4.93708Z" />
              </svg>
            </IconWrap>
            <IconWrap href={DISCORD_LINK} target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
                <g clipPath="url(#clip0_605_33975)">
                  <path d="M20.317 4.49197C18.787 3.80197 17.147 3.29197 15.432 3.00197C15.4167 2.99904 15.4009 3.00093 15.3868 3.00738C15.3726 3.01383 15.3608 3.02452 15.353 3.03797C15.143 3.40697 14.909 3.88797 14.745 4.26797C12.9261 3.99621 11.0769 3.99621 9.25799 4.26797C9.07533 3.84683 8.86934 3.4362 8.64099 3.03797C8.63325 3.02436 8.62154 3.01342 8.60743 3.00663C8.59331 2.99984 8.57746 2.99752 8.56199 2.99997C6.84799 3.28997 5.20799 3.79997 3.67699 4.49097C3.66382 4.4965 3.65265 4.50592 3.64499 4.51797C0.532992 9.09297 -0.320008 13.555 0.0989923 17.961C0.100158 17.9718 0.103508 17.9822 0.108837 17.9917C0.114167 18.0011 0.121364 18.0094 0.129992 18.016C1.94638 19.3384 3.97233 20.3458 6.12299 20.996C6.13798 21.0006 6.15402 21.0006 6.16901 20.9959C6.18399 20.9913 6.19723 20.9823 6.20699 20.97C6.66899 20.35 7.08099 19.695 7.43299 19.007C7.45399 18.967 7.43399 18.919 7.39199 18.903C6.746 18.6597 6.12008 18.3661 5.51999 18.025C5.50921 18.0188 5.50012 18.0101 5.49355 17.9995C5.48698 17.989 5.48312 17.977 5.48233 17.9646C5.48153 17.9522 5.48383 17.9398 5.48901 17.9286C5.49418 17.9173 5.50208 17.9075 5.51199 17.9C5.63799 17.807 5.76399 17.71 5.88399 17.613C5.89479 17.6043 5.9078 17.5987 5.92158 17.5969C5.93535 17.5952 5.94934 17.5973 5.96199 17.603C9.88899 19.367 14.142 19.367 18.023 17.603C18.0357 17.5969 18.0498 17.5946 18.0638 17.5961C18.0778 17.5977 18.091 17.6032 18.102 17.612C18.222 17.71 18.347 17.807 18.474 17.9C18.484 17.9073 18.492 17.917 18.4974 17.9282C18.5027 17.9394 18.5052 17.9517 18.5046 17.9641C18.504 17.9765 18.5004 17.9885 18.494 17.9991C18.4876 18.0098 18.4787 18.0186 18.468 18.025C17.87 18.369 17.248 18.66 16.595 18.902C16.585 18.9056 16.5758 18.9114 16.5682 18.9188C16.5606 18.9263 16.5546 18.9353 16.5507 18.9452C16.5468 18.9551 16.5451 18.9658 16.5457 18.9764C16.5463 18.9871 16.5491 18.9975 16.554 19.007C16.914 19.694 17.326 20.348 17.779 20.969C17.7884 20.9817 17.8015 20.9912 17.8166 20.9963C17.8316 21.0013 17.8478 21.0015 17.863 20.997C20.0173 20.3486 22.0466 19.3407 23.865 18.016C23.8739 18.0098 23.8813 18.0017 23.8868 17.9924C23.8923 17.9831 23.8958 17.9727 23.897 17.962C24.397 12.868 23.059 8.44197 20.348 4.51997C20.3413 4.50723 20.3303 4.49729 20.317 4.49197ZM8.01999 15.278C6.83799 15.278 5.86299 14.209 5.86299 12.898C5.86299 11.586 6.81899 10.518 8.01999 10.518C9.22999 10.518 10.196 11.595 10.177 12.898C10.177 14.21 9.22099 15.278 8.01999 15.278ZM15.995 15.278C14.812 15.278 13.838 14.209 13.838 12.898C13.838 11.586 14.793 10.518 15.995 10.518C17.205 10.518 18.171 11.595 18.152 12.898C18.152 14.21 17.206 15.278 15.995 15.278Z" />
                </g>
                <defs>
                  <clipPath id="clip0_605_33975">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconWrap>
            <Account />

          </div>
        </div>
      </Header>

      <Content style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', fontFamily: 'avenir-lt-w01_85-heavy1475544,avenir-lt-w05_85-heavy,sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>MINT DATE</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', }}>

                <Countdown date={stageInfo ? new Date(stageInfo.startTime * 1000).toUTCString() : new Date(START_TIME).toUTCString()} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '10px' }}>
                <div>Days</div>
                <div>Hours</div>
                <div>Mins</div>
                <div>Secs</div>

              </div>

            </div>
          </div>
          <Card style={{ borderRadius: '24px', fontFamily: 'avenir-lt-w01_85-heavy1475544,avenir-lt-w05_85-heavy,sans-serif', display: 'flex', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            <div>
              {/* <img src={mint} style={{ width: "250px", height: '190px' }} alt='mint-doo-doo' /> */}
            </div>
            <div>
              <Text>{MAX_SUPPLY - totalSupply} / {MAX_SUPPLY} </Text>
            </div>
            <div>
              <Text>left at {stageInfo ? ethers.utils.formatEther(stageInfo.mintPrice.toString()) : MINT_PRICE} ETH each</Text>
            </div>
            <div>
              <Select style={{ marginTop: '16px', width: '210px', borderRadius: '10px' }} defaultValue="1" onChange={handleChange}>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
            </div>
            <div>
              <Button style={{ fontWeight: '500', color: '#ffffff', border: '0px solid rgb(174, 99, 63)', background: '#000000', marginTop: '16px', width: '210px', borderRadius: '10px' }} onClick={handleClick} disabled={mintButtonDisabled}>Mint</Button>
            </div>
          </Card>
        </div>
      </Content >
    </Layout >
  );
}

export default App;
