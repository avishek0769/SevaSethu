// src/hooks/useWallet.js
// REAL MetaMask connection using ethers.js v6
// Connects to Polygon Amoy testnet (chainId 80002)

import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'

const POLYGON_AMOY = {
  chainId:           '0x13882',
  chainName:         'Polygon Amoy Testnet',
  nativeCurrency:    { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls:           ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
}

export function useWallet() {
  const [provider, setProvider] = useState(null)
  const [signer,   setSigner]   = useState(null)
  const [wallet,   setWallet]   = useState(null)
  const [chainId,  setChainId]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length > 0) initProvider(accounts[0])
    })
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length === 0) disconnect()
      else initProvider(accounts[0])
    })
    window.ethereum.on('chainChanged', () => window.location.reload())
    return () => window.ethereum.removeAllListeners()
  }, [])

  const initProvider = async (address) => {
    const p = new BrowserProvider(window.ethereum)
    const s = await p.getSigner()
    setProvider(p)
    setSigner(s)
    setWallet(address)
    const network = await p.getNetwork()
    setChainId(network.chainId.toString())
  }

  const connect = useCallback(async () => {
    setError(null)
    if (!window.ethereum) {
      setError('MetaMask not found. Install from metamask.io')
      return null
    }
    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: POLYGON_AMOY.chainId }],
        })
      } catch (e) {
        if (e.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_AMOY],
          })
        } else throw e
      }
      await initProvider(accounts[0])
      return accounts[0]
    } catch (err) {
      setError(err.message || 'Connection failed')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = () => {
    setProvider(null); setSigner(null)
    setWallet(null);   setChainId(null)
  }

  const shortAddr = wallet
    ? wallet.slice(0, 8) + '...' + wallet.slice(-6)
    : null

  return {
    provider, signer, wallet, shortAddr,
    chainId, isCorrectNetwork: chainId === '80002',
    loading, error, connect, disconnect,
  }
}
