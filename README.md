# [Cass-Study-Zeiss]


## To develop a WeChat Mini-app, drive visits to a Wechat service account

- Build a Mini-app,share QR code


## How to visit a Wechat service account
- Use native component named official-account. Before using this component, I need to go to Mini Program Console, and choose Settings > API Settings > Official Account Following Component to set the Official Account to be displayed. Note: The Official Account and the Mini Program must belong to the same entity. 
Check https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
- Use web-view to link a article

## Sample Code
<official-account></official-account>
<web-view src="https://mp.weixin.qq.com/s/pGX4Rx6ino792EcxZsJacA"></web-view>
