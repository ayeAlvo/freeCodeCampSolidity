const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const AMOUNT = ethers.utils.parseEther("0.1")

async function getWeth() {
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)

    const iWeth = await ethers.getContractAt(
        "IWeth",
        networkConfig[network.config.chainId].wethToken,
        // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        // deployer
        signer
    )
    const txResponse = await iWeth.deposit({
        value: AMOUNT,
    })
    await txResponse.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT }
