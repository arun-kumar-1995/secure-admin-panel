import { Model } from '../helpers/baseModel.helpers.js'
import { IpBlocked } from '../schemas/blockIP.schemas.js'

class BlockIPModal extends Model {
  constructor(blockIPModel) {
    super(blockIPModel)
    this.BlockIP = blockIPModel
  }

  async find(ipAdrr) {
    return await this.BlockIP.find({blockedIP: ipAdrr})
  }

  async createBlockIP(props) {
    return await this.BlockIP.create(props)
  }


}

export const BlockIPModel = new BlockIPModal(IpBlocked);
