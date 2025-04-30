const ethers = require('ethers');

// Set up the provider
const providerUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || 'https://sepolia.infura.io/v3/26dbdcda81b64b77acb2273c0aa828dd';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

// Contract details
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractAbi = [
  'function jobCounter() view returns (uint256)',
  'function jobs(uint256) view returns (address client, string description, uint256 budget, bool isOpen, address freelancer)'
];

async function testContract() {
  if (!contractAddress) {
    console.error('Contract address not set. Please set NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.');
    return;
  }

  console.log('Testing contract connection...');
  console.log('Provider URL:', providerUrl);
  console.log('Contract Address:', contractAddress);

  try {
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    console.log('Attempting to call jobCounter()...');
    const jobCountBN = await contract.jobCounter();
    const jobCount = jobCountBN.toNumber();
    console.log('Success! Job count:', jobCount);

    // Try fetching details of the first job if it exists
    if (jobCount > 0) {
      console.log('Fetching details of first job...');
      const jobData = await contract.jobs(1);
      console.log('First job details:', {
        client: jobData.client,
        description: jobData.description,
        budget: ethers.utils.formatEther(jobData.budget),
        isOpen: jobData.isOpen,
        freelancer: jobData.freelancer
      });
    }
  } catch (error) {
    console.error('Error interacting with contract:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    if (error.data) {
      console.error('Error data:', error.data);
    }
  }
}

testContract();
