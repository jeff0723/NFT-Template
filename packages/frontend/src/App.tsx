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
type Voucher = {
  voucher: {
    redeemer: string;
    stageId: number;
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
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{ padding: '16px' }}>
            <img src={logo} style={{ width: '150px', height: '100px' }} alt='logo' />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <Account />

          </div>
        </div>
      </Header>

      <Content style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', marginBottom: '64gpx' }}>
            <div style={{ marginTop: '32px', marginBottom: '64px', display: 'flex', flexDirection: 'column', color: 'rgba(99,155,232,1)', fontFamily: 'avenir-lt-w01_85-heavy1475544,avenir-lt-w05_85-heavy,sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>MINT DATE</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', }}>

                <Countdown date={stageInfo ? new Date(stageInfo.startTime * 1000).toUTCString() : new Date(1643466600000).toUTCString()} />
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
              <Text>{6999 - totalSupply} / 6999 </Text>
            </div>
            <div>
              <Text>left at {stageInfo ? ethers.utils.formatEther(stageInfo.mintPrice.toString()) : 0.00} ETH each</Text>
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
              <Button style={{ color: 'rgba(110, 110, 110, 0.96)', border: '0px solid rgb(174, 99, 63)', background: '#FFB7C1', marginTop: '16px', width: '210px', borderRadius: '10px' }} onClick={handleClick} disabled={mintButtonDisabled}>Mint</Button>
            </div>
          </Card>
        </div>
      </Content >
    </Layout >
  );
}

export default App;
