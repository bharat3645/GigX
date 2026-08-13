const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Escrow", function () {
  const depositAmount = ethers.parseEther("1");

  async function deployEscrowFixture() {
    const [client, freelancer, other] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.connect(client).deploy(freelancer.address, {
      value: depositAmount,
    });
    return { escrow, client, freelancer, other };
  }

  describe("deployment", function () {
    it("sets client, freelancer, and amount from the deposit", async function () {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      expect(await escrow.client()).to.equal(client.address);
      expect(await escrow.freelancer()).to.equal(freelancer.address);
      expect(await escrow.amount()).to.equal(depositAmount);
      expect(await escrow.jobCompleted()).to.equal(false);
    });

    it("holds the deposited funds", async function () {
      const { escrow } = await loadFixture(deployEscrowFixture);

      expect(await ethers.provider.getBalance(escrow.target)).to.equal(depositAmount);
    });

    it("emits PaymentDeposited on construction", async function () {
      const [client, freelancer] = await ethers.getSigners();
      const Escrow = await ethers.getContractFactory("Escrow");

      const escrow = await Escrow.connect(client).deploy(freelancer.address, {
        value: depositAmount,
      });
      await expect(escrow.deploymentTransaction())
        .to.emit(escrow, "PaymentDeposited")
        .withArgs(client.address, depositAmount);
    });
  });

  describe("markJobCompleted", function () {
    it("allows the client to mark the job completed", async function () {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await escrow.connect(client).markJobCompleted();

      expect(await escrow.jobCompleted()).to.equal(true);
    });

    it("reverts when called by anyone other than the client", async function () {
      const { escrow, freelancer, other } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(freelancer).markJobCompleted()).to.be.revertedWith(
        "Only client can call this."
      );
      await expect(escrow.connect(other).markJobCompleted()).to.be.revertedWith(
        "Only client can call this."
      );
    });

    it("reverts if the job is already marked completed", async function () {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await escrow.connect(client).markJobCompleted();

      await expect(escrow.connect(client).markJobCompleted()).to.be.revertedWith(
        "Job already marked as completed."
      );
    });
  });

  describe("releasePayment", function () {
    it("reverts if the job has not been marked completed yet", async function () {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(client).releasePayment()).to.be.revertedWith(
        "Job not completed yet."
      );
    });

    it("reverts when called by anyone other than the client", async function () {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      await escrow.connect(client).markJobCompleted();

      await expect(escrow.connect(freelancer).releasePayment()).to.be.revertedWith(
        "Only client can call this."
      );
    });

    it("transfers the escrowed funds to the freelancer and emits PaymentReleased", async function () {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      await escrow.connect(client).markJobCompleted();

      await expect(
        escrow.connect(client).releasePayment()
      ).to.changeEtherBalances([escrow, freelancer], [-depositAmount, depositAmount]);
    });

    it("emits PaymentReleased with the freelancer and amount", async function () {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      await escrow.connect(client).markJobCompleted();

      await expect(escrow.connect(client).releasePayment())
        .to.emit(escrow, "PaymentReleased")
        .withArgs(freelancer.address, depositAmount);
    });
  });
});
