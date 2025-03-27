import { Model } from '../helpers/baseModel.helpers.js'
import { IpBlocked } from '../schemas/blockIP.schemas.js'

class BlockIPModal extends Model {
  constructor(blockIPModel) {
    super(blockIPModel)
    this.BlockIP = blockIPModel
  }

  async findOne(ipAdrr) {
    return await this.BlockIP.findOne({ blockedIP: ipAdrr }).lean();
  }

  async createBlockIP(props) {
    await this.BlockIP.create({ blockedIP: props })
  }
}

export const BlockIPModel = new BlockIPModal(IpBlocked)
