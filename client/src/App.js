import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Donation from './Donation.json';

const CONTRACT_ADDRESS = "0x690c3541C948Db52f3b0429fd72A60607481F2A8";

function App() {
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState("0");
    const [contract, setContract] = useState(null);

    const connectWallet = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(CONTRACT_ADDRESS, Donation.abi, signer);
        setContract(instance);
    };

    const donate = async () => {
        if (!contract || !amount) return;
        const tx = await contract.donate({ value: ethers.parseEther(amount) });
        await tx.wait();
        getBalance();
    };

    const getBalance = async () => {
        if (!contract) return;
        const bal = await contract.getBalance();
        setBalance(ethers.formatEther(bal));
    };

    useEffect(() => {
        if (contract) getBalance();
    }, [contract]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Donation DApp (Truffle)</h2>
            <button onClick={connectWallet}>Connect Wallet</button>
            <input 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount in ETH" 
            />
            <button onClick={donate}>Donate</button>
            <p>Total Donated: {balance} ETH</p>
        </div>
    );
}

export default App;
