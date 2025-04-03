import "./PaymentInfo.scss"
import { Heading } from '../../Heading/Heading'
import CustomInput from "../../Utils/CustomInput"
import { useState } from "react"
import CustomCheckboxes from "../../Utils/CustomCheckBoxes"

export const PaymentInfo = () => {
  const [cardName,setCardName]=useState<string>("")
  return (
    <div className="payment__container">
        <Heading title='3. Payment info'/>
        <div className="payment__inputs">
          <div className="input card__details">
            <CustomInput
              type="text"
              label="CardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              />
            <div className="card__expiry">
              <CustomInput
                type="text"
                label="Exp MM"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                width="10.25rem"
              />
              <CustomInput
                type="text"
                label="Exp YY"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                width="10.25rem"
              />
            </div>
          </div>
          <div className="input">
          <CustomInput
            type="password"
            label="CVV Code"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            width="10.25rem"
          />
          </div>
        </div>
        <CustomCheckboxes/>
        <div className="bottom__component">
          <div className="total__amount">
            <p>Total Due:</p>
            <p>$Xxx.xx</p>
          </div>
          <div className="disable__button">
            <p className="edit-link">Edit Billing Info. </p>
            <button>
              <p>Purchase</p>
            </button>
          </div>
        </div>
    </div>
  )
}
