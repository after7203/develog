import "./Write.scss"
import { set, useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from "react"
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { spinnerContext, userContext } from "../../App";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css'

const Write = () => {
    const { user, setUser } = useContext(userContext)
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsLoading } = useContext(spinnerContext)
    const [input, setInput] = useState({
        title: '',
        tags: [],
        brief: '',
        scope: "public",
        url: '',
        series: [],
    })
    const init_series = location.state ? location.state.series : []
    const [isFocus, setIsFocus] = useState(false)
    const [handleSeries, setHandleSeries] = useState(null)
    const [userSeries, setUserSeries] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(null)
    const [isCustomBrief, setIsCustomBrief] = useState(false)
    const [isCustomURL, setIsCustomURL] = useState(false)
    const [isCustomSeriesURL, setIsCustomSeriesURL] = useState(false)
    const [isCustomThumb, setIsCustomThumb] = useState(false)
    const tagRef = useRef()
    const ref_editor = useRef()
    const series_url_preview = useRef()
    const ref_series_add = useRef()
    const toast_null_title = () => toast.error("제목을 입력해주세요", { theme: "colored", autoClose: 1500, })
    const toast_null_contents = () => toast.error("내용을 입력해주세요", { theme: "colored", autoClose: 1500, })
    const toast_duplicate_name = () => toast.error("이미 존재하는 이름입니다", { theme: "colored", autoClose: 1500, })
    const toast_duplicate_url = () => toast.error("이미 존재하는 URL입니다", { theme: "colored", autoClose: 1500, })

    useEffect(() => {
        // axios.get('https://api.ipify.org?format=json')
        //     .then(({ data, config }) => {
        //         consolelog({    
        //             data,
        //             headers: config.headers,
        //         });
        //     });
        if (location.state) {
            (async () => {
                // const dataurl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXYAAACECAYAAACEcwDDAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAe8ElEQVR4Xu2dB9QURbbHiX4gQRBEooJIUlEJiqAoKEd46i6HBSRJfGJARPCgK0GXRR8CR3mAiLCioIjy8LmIRyWKICCSJUgOCqJEFQxLUHj/6/b4xnFm+laH6e75/nPOnt3lu3Wr6lfVt6tv3bqVJw9/JEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJBBH4LXXXuuI/3s2yX/O4N/kP7/9rXnz5rOPHDlSnABJIFMEfvrpp/z33nvvhBRz9A/z9qqrrlq3devWSzPVPtaTPQQKZE9Xfu1J3hT9Sfbv8m+p5LMMC7sTEgIy3/IZtEVkOUcNgFH03wRMJlkUmMmqx+RnKm+im7IkkEhA5pt8OfJHAr4SyDbDbgKLK3YTWpQNggBX60FQz4I6c7Nhl+Hjg5MFk5hdIAES+D2B3G7YOR9IINMEuJjINPFcWF9uNux0xeTCCc8uk0BuIJCbDXtuGF/2MdoEuPiI9vgF1noa9sDQs2ISIAES8IcADbs/XKmVBEiABAIjQMMeGHpWTAIkQAL+EKBh94crtZIACZBAYASyzbDzJGlgU4kVkwAJhIVAthn2sHBlO0ggFQEuPjg3fCdAw+47YlZAAiRAApklkG2Gnaf6Mjt/WJsZAa7WzXhR2iGBbDPszJzncCKwGAmQQPYQCIVh//rrry+YNWvW7YMGDXry9ttvf69GjRo7gDjZhRm//luxYsV+bNy48cft27efMXbs2D7Lly9v8MMPP5xrlcn46Ej7J02a1A3tecOu7en6VadOnfXQMX3ChAk9P//884puOzJgwID/Sldf/N9GjRr1kNv6YuW/++67Im3atHlTW/dbb73V0m3dJ0+eLLBkyZKG0mfMjaWYI//S1h8vd/755x9r2rTpYugZ9uGHHza25pXb5oWm/OnTpwvI5R2Yrz169er1PPq6SPqcjtXFF1/8ZbNmzRZCfryUk/LQE8jXMZ6LCmhD927duk2+7rrrVjoZY6dlcDnPPFzOc15oBjOMDTl27FiRadOmtcNDuMQp6PhyeJCPXXLJJTu1uqxBKumGjRiSVq1a/VNbp6mcsJk3b97NTh8ilL1FW2fnzp1fPX78eGE3PGJlV69efXW5cuUOaurGLUGfurklSB60Z555ph+Mzxea+kxlYPS+HThw4JNfffXVhW7Z4AalfIY3KG0Em+pu65Xye/bsuWjo0KGDveIEPXuhb5Do9aJ96XTg5ZozZcqUzrVr195oOn5eysNmLMB8c2Uz/GYVmH4MUiGsDvt6NcGcDpwbwy6TuUuXLq84rdu0HF4eM3ft2lXFdNCwuinfqFGjjzX1VatWbef69esvN60jmbx8cWjqFBnrhVLItN4TJ07kx8KgPb6QtmrrciMHA3/05Zdf7op6zzFta0wehj0vDPsL2nbgpefasGOuXty9e/eXsfD5XluviZx8PUP/ZKnHKZd05ebPn9/0mmuuyejKPFX/LcNewo9+RlrnqlWr6lx//fVLTSaOX7JODfvs2bNvzZQxie+7rJBmzJjR2nQC9OnTZ4yWIe6M7WCqP1EexquAifGSl7xpnUePHi0ubgRtv7yUkxcRXG9lTNss8pk07HgBFRw3blwvvJCOeNn/VLrky8Z68RV0wiaxjCwA8aWkdiVmoo+wGR9gxU7DHj9YWF11wOB/k4kB0NRhatjhDskn/kW/Vj6aNqPun8S/aPLgWMY65X5FfL3iJoDxcfVg7t69u1KDBg0+0fRH3DVw29Qx6Y/4WLEP865Gv18ysg+EdlQyaXcmDTtefCWCevE9+OCDY+DSk/0uxz8x6kG1P92coSsmbkhhEPNbBvFHvx40J3pNDbt89gdp1GN9FOMubdE+NZs2bapRq1atLRpGcNt8IoZTqzuZnGyCa+oSmRYtWsw9fPiw2md54MCB0i1btnxbq99PObRjlrTHhFUmVuxo0wVt27ad4Wff7XT37NnzH3i5ONpkBKNzevfu/ZxdHUH8nYY9brZbBjFURl0mhYlhX7Ro0Q1B7wnET2SJUpA2aYwKVk+FxH2gfRBgmO/Q6E0lYxKJI5En2rqwijsnbKs4aQ/apd5w9tuwS1vCwshiY7x3YtmLk9r5mkk52Iz53DwF8c2bN1fDBtD6TMLX1qU17OhDdbgWVmj1ZkoO7oDZEmapMYxWKKPKHWMZZo3aP8hg9X0eVuFztAysqB1VXcOHD39UqzeTclOnTu2o6gCE/Dbso0ePfjCTfbery4SNMEQEUNWw2ou4xWAJ7XhnpRwmcY5JaJfdJPH67xrDLv5mfBaO87pur/SNHDmyv2byWOGHX2vqRbzyBwjtU70wEuteunRpA3EVaeqB22e5NlYfeq+TzWON3kzL4KW/cvv27aqIJT8Nu0Q0aV1umWJkRfVU08xRkcFm6VOZapuTeiybEQnD7tsBJcR43/D666930Q5qQHJpj3hjRdn8lVde+c+A2mZb7eTJk++BD72mnSCM4m6JF7eTk7+vWLGiATZAq2pkE2VWrlx53ffff69yTSAmeX2ZMmUk1j3t75tvvik2ZsyY/l988YXxZqWdbi/+Dl7XYGXazQtdTnVI6Oerr77afcuWLbZzwWkdTsrhZXMF2tVNAg/syste0MyZM42jvuz0evz3yKSEsAXuBIwcKHjjjTc6ax9yJ3X4XUYMCvx9XdEHYz+h322L6ceDXG3u3Ln/YVffBRdccNwKM7UTzYP+FoGxamgrmCAAX37OunXr6mnLSWzyueeee9pO/qOPPmoyZ84cV35/uzrc/h0LgNvwMtQe1PH8xObOnTurvf/++6FkBGPdZtu2bTXsGGMe3xa2F5Ndm8P8d18MOw7TVF22bFnjMHccbYv5nJM2c+3atfVgUG4LeR/yIK7+TxrXCVwGy7V9QYqGRkgLUFQrL3J79+6tDJdPfU0ZHIbaDcMu+xZpf7Jh+vbbb7fGyybHTjbIv+NFWH/hwoXNgmoDXiwtYBRtjWcQ7UO7qsOVltYWyCIKMjc5aR/OlGxHWpHe+/fvL4fyscu/1f+Nehs5qTfsZXwx7DAM1+/YseMS086LH3XEiBGPYvVTGbk/5GH+wwCdOXMmHybCeZLHo0OHDq+b1qGVf++99/4Mg+IoHhftegOuqEbwqYpbIu0kgwEt5qYvCxYsaIqDXw3s+nX55ZdvaNKkyYd2cvJ3fELXgevD6CThp59+WhcPcS2NfriF1lpRRmnFsZlWS1ZyGp2JMpKzx3rgy//yyy8yz1OOg4Tk4uRkJTksJYbCSX1YBNyueBl6vlq3vpTqOmkzXq6r4Sq5C0ZRGOVPxkjY4e9lRQ7yq5zUI4u8dLHt4vr75JNPrjfVLSeyMT+a4RDe8xUqVDhgWt6Sj4x7xWH/vCkmG45ONk0RHjXu0KFDxpt27777bnM8jKo4bfTwt8gQbITMTZXQR2K5ZXMvXl7zv+XYueS00PgUk9HGydK/ONkk1IYN9uvX71lNP0QGaQHuMZkRJrqfffbZfhrdJtE88f2S/D3ajdnEdiDSqBTCQ6doOcXk8BWyS3zK6frlR64YLKCq1KtXb41Je7HB/YPkecEXURHNOMRk5AsK5QZKGgGT+qxN1EtT1TV9+vS2JvpEVs4zSMy+SfuTyWLFLm5HVcSYZTNKuK0zkuVhnEsismKBFpbIDRs27K/YAHL8uQ0XwJXa046xdqUz7BKFoY3uiOmTh0WSmrkdNNEhukz4IZPiW4rVYh4ri6JqElunUFV5UbCiuwBfA4s0bZa+CV87TqYRJLG6rQfe6OBQYltgMEo6OQiFMwB/8sGwp40qWbx4sZxnUI1pTA6ho4/IV4rdGKT6O8pLNJZRnVY7k6qU5GQm+vCi2CBhyE7bH1/OmouqvkTJsHvuisGJs1IHDx5UZ8LDKbk377vvvgmFChWSQwmOfvXr19/Qt2/fZyyDqNWR8hMMq71LTDd+O3bsOFU+DbWVp5Jr3br1jHvuuWe8iR64Eaoihtx29QJ3zCYrTthWPT6NG8FvrtoQ/Oyzz2rjwJTKR4rV5eoqVarstmsADHsRGQc7ufi/S4qChx9+eGTZsmUlP4rjH8p/O3jw4L/h62mfiRJwSLtiN9Glld23b59qjGL65FQoQnifL1iw4C/aOhLlMD8nynNrUh5jmTIkFC9S8Y+rf0jAN/myyy5z5DJTVxJxQT8Me+mNGzeqJzgyw71k5YN2hRJv0zn4UpjnSolV2DTcDwblUI8ePSYhyuOU2/rxgjt75513TodOiTtX/eC/PE8MoZ1w+fLlv7zyyis32MnJ3+FWqI1oBlX4nEkUDXLOrylduvRhuzbATVYGD3xZO7n4v8PYTLcOk5kUSyoLf/J6rNrfMlGExUAxG3nPfex4+ar3QiQlRrt27aYXLVpUzho4/uF5/R73BkwzUZBqz0a+zKw9EJU6xOpvxbM+WyWci4U8N+wmLOHHXoE372cmZVLJYrL9ULduXfE1evEz2lDBC2UuJpwn/ZDGiy7LnaXqC/yslRVGJU/x4sVPIuxR8t+rfliF34xN7LSf7HABFcZL4GqVQgjBZbMwJydHw9fYCN5xxx3v4MXoeCWa2AfRp+2XyGFT/3zJdWJSxq3szz//XECrA19LazG3Nmvl08nJc2vlR/dCnVoHvs5XXXTRRXJYjb80BDw37Ok+uRLbISvIEiVKfOfVCGk+8e3qgiHL++2336oTU1mGeDOM5gk73dq/iwHGZpzcIuX5Dw/GSu3XAOLS62PlnNbFgxjq6oh6UOWtkU00K+Wxbb+wUVcU+zXq9LgwWusw/ntsFRsIiAGRNhsUCbXopZdeusOr5w1nIw7h+f1K22Hsw1SQlM6J8thbK/zll1+qD59VrFhxH54PV18c2jZHWc5zww4Y6pVWqVKljpxzzjmOfetJwKvrTjVoEvalcWvEl4cBkNt7PP1Zt0F5qlOUQe8uXCkmaXVtf2vWrKlnF8KIjetrEUmicpnADfQpjMF+24ohgAe+kFav6IN751DJkiWPanRrZaDzIPztqvZqdQYplz9//l/y5s3r1b3Amq8u2+5K+LLJV0fhwoXlykP+bAj4Ydg9GfCARy4MffClDSYuK4njl8NKqcYCL8D8WNWrY6jFDWTwZWP6khZernLJp1go+DIOAc5vU64BNpVVOyWg9s85rSA3lLvrrrvkoJTbw1LxBiQvdJqiUxughg0bLsNG2nEY7uJ2leAEbn34jovjhXA8UVaiGXAwSZVGQNw/4gayqy/u7+r+SBkcVGmBFbaraJjEtkGfQXN9EfXDCBtx9aVX7pT6wcRdi0JY2o8Vewi7GYkmxZ+M9LXBsoEmPmlNJQh7vA5RQknDDhH9dJUkwdLokTBLhA9+rpGNuEzUDWfE8fve/Ei8WPww7JHouO/DH+IKcPz6kIQdapoofm740ZMab4l11+gQGUn6hQ23Y1p5ypFACAlExrb5YdhDOB5sUiIBCTvUUrFyffwuHS8ORBU38a83btx4sbY+yuU6AvzK8XjIadg9BhoVdZJfR5ujfcOGDVcjg2T5+L7h8FItbZij3KVavXr1bVFh47KdkVnVuewni4eYAA17iAfHz6ZJiKY27FFOoSa6Y6xLNVSpfbFpugJhg+qTtH7222fdfhh1P3T6jCGleq7MM0Sehj1DoMNWDdIf/AI/+1ptu8SQy009Im+aKvbaa69dgROhXsVPa5tMORLItQSyzbB7tbrxSk+oJ5aEPWpPuMpBpFiyJslPgv9vm6FROi/pbOUavFCD8K5xditSu79715LoaCITH8Yq2wy7D4gio9L4ZYTwwz3abI8ff/xxQ1za/OstPdalGqq0qdC/LpeEOQqaWMhqmCeN8TwJc2fYtuQE/DDsUXkDZ9sEN3Z1IG/Iv2TVrn04cNPTzZLvA6kGVFfgiV5snC5DPbkpt4fxOGj5U+5XAlGxL4EOlx+G3aRDUVjh2PYHyfrlWq+0V+D5/fcbbrjB9g7RZB2Ru1AlnattJyEg4Y3IJFlDe2m1XFYC/7oqL42m/nQy1sUgcpVhYOMwceLEezUXdLvtazaVz5cv35kCBQr8rO0TEvSdL4n6tPK5VS5owx5G7k4mjXpihq3DkhRMm8Mc4Y034e7Lrkjn20TTD5xuXYWMi7s0sh7JuM6H71E7qCY5gT88W9hUPyEZG7XAkG20NAx7Ia28x3KR+VoI1LDjtqXSp06dymj+ao8HOqYuUI5u+oRsi0fkVKhGh9wqhftKH9HIioy4eXDK1fZSDa0+GzkxGpEdhxR9c7LISIlJMpeePXvWE0bIypgf+kxyTaXri7qfsolvcrmIR3MrXk0kjLsngxzf68qVK6tzYuPQS0Vc1FDSB/iOVcqndC6Juf6NEeLZP3YMLE1BN3olpbPhRQ6xeyv96EpW6JTc+XjeSnjRGaSaKI9bkSprdeEF/yWerT982eLfzko6Ya0epJGuIQnftPIKuUgYakU/fifiuWE3aQAiLa6VnN8mZTIhazLRpD3YUBTfbmR/cgIVm5yeGne5cFh7qUYycMgbflb8r1qoMgYmeb21ej2WU69MtfWa+KfxrF1jl19fW++qVasaYL+lqlYecin7joXUAQM9eeAO7OHVZdYm9UZJ1nPDbrrSwiB1R3x04PlR4wcND4t6BSHlNm3aVDtKg57Y1jJlyhw0XB3bdldW624uIJGXq4nR2rVrVw2kFy5l27AsEzBhLK40PG/djh07Znc3a1pKuKy+9DvvvPMXE5TpQl5N003ISegBAwaMhN2wvcBd0UbPX7aKOn0X8cWwX3jhhYe0LZ81a9afhw4dOgRXoXmx6vVkkEweFunnkiVLmkjOcm2fwyYnn8heJ+mSU63JPr21fcdtSN+Y5FfH118DWZFq9WeLHFyfu036AsPe5YUXXrjv9OnTae+yTaUTp48LvPTSS3fDsN9hUm86Fy2u7NuOfP1Gq3bYjZb333//RFzFWdGkHUlk1V+FLuvJaHHPDTtC3H4wfQOPHz/+gUcffXQk7rh0u3L3ZJCqVq26QxsCKKO1YMGCFrNnz74toyPncWVyOhSnRLd7oRYP6UG5dNiNriJFivyIcdhpokNWox6t4kyqDVQWi6gDiD5SpWCONfSxxx4b+dRTTw0yXUwhlcS5Q4YMGTpw4MCnTTqN9qW9EtG6rnG5iU6RnTlzZqvmzZsvHDt27AO4U7UsNnOd2DPTF1xW+uRV7CdMmNATgrHNLPV/43NtL1bvg8V3h5Am42vOXnvttQ6oV4y7bZ2YEHMROnVesg5hkpRBWltJM2urJyaDtu+bOnVqB6xojNutguqzkOR/6dy58ysmfU4l26pVq3/iC8bV575018k86tChw+t79uy5yGdcjtRjHyCfxNtrGWOf4rOtW7emPeFrjdurWp3xcoiGWoOXYSfM93KpjCL+Pa8YTZGDvLys1c9ETBbzaqq8FNJBQ7RVXye6DcuobEMqnelshqMJEbVC8DnXxC09WwyhG08YN/rtBgk+vGFO9IveadOmtd+3b195fO46WUEENtyjRo16yEmfE8s8+eSTg7zoBHypl1u5bIzmhlzjh1XlU7jdqZ7c2+pFW7zQ4Ydhd/oC9GKctTomTZrUw44fbEYNudlLqzMIOTubYdfHTP7dF8Mj/jTtoZdMdtakrltuuWWeuJVMyogsQrFu7dSp0xuVKlXaX7BgQdmENTJKpvL4Smlv2sZU8nJKVO5CdatPTrO61SHlxSWGC7CXmuqSr4Vhw4YNQjtWoz8/mjI1lQ/6gcep449gFLeacsqEPNq1XRP2esUVV2zDl95bmWhTbqjDF8NetGjRk7iMeYocKY8qREzG5a1bt/7fCLTfkw1j6aeEJ8KQugp7RNjkcuyxeGJkMI9OYR69YhnnMA+F+Gl9eZY0nQ6zUWzTps10tE81H7p06TJZm5ROwyU3y/g2GSUuumPHjuL7i+RPXk7wDU6RjcBIdsBBo+VOUpMc7cmqkNU6vti+clB90iLygm3fvv00r/RFUI9qs65du3avh23VDiO9EV+vahtQs2bN3QiieNrJl3IEx9XXJvtm2BHqduqhhx4aJQdVfO2Bc+W2K124YxZ37959kvMqoleyadOmH7hpNSIgVrspn1hWXrC9e/ceEzajldBO27nkkIlaL56zzdiYHe+wHl+K9e/ffziMtVGuIHHHdO3a9WVfGpSLlPpm2IXhZZddtgNv4GFRdsn06dNnTMuWLd8J8ZxQP/yaPogbxekpVL8u1RCjNXjw4CERcMloEPsmc/fdd7/Yq1ev532rwECxtEOiowyK/CoqZx+GDx/+V5QfZ1qW8v9PwFfDLtXceeedbz7++ONPRNW447jz4aeffro/XAyqRFkBTC7Vp7q2XZInx2kMOtwmy/zK5ohP+v8ZNGjQ37X9CLGcp+MV30983Zx44okn/oaFyNtB9r9t27Zvoh1DpD1O2iHlRo4c2V8im5yUZ5kMbPggMuRMv379RiFK4ZGorrjkywOn7bq43Vj0acJ5umJHGtWzckepk7aKf7548eInnZTVlOnbt++oESNGhHEemYyBX7K/IsSL+eiLL77YA/tDat+2hr1WpmfPnv+Q8wdoxxFtmWRy4oKDzXh8/vz5TSXe3o0ulvWZAE5o3mT53H0NAUQ3bPUjRG0eDigZpQFAutByOAAjG3m2+jMlYx3K8nTkrJhio3MI8tLGhSOqe1DdNhbnBNpZuUdCMQ5y+hFzyTZLKeLY8xseUNqCA0rVnPDCqdIcHPYbZG1E+s4JZwe+lXMQ6GOOk/amK4O+FJoyZcpd1lez731J9ewGHdbqNVdP9SFtQEn5xMJEkFt7gh4kI8MuICRXhhgWhAbK8fvA2h+r2w/D7uQ0Y4sWLWYfPnw46UleTyeQpQynSysiPG5KGMYAD/wHYTPsMebIn1Pb8nX7NlfltC/uwb3cj3FO1IncMBVw4KkbfpPh+hP3qG/9StRNw64YYWSIK/Xcc8/1Qo6SQE6bYZDmax7GVF2RdASSoyJoAw/D3kmB21gEq6++Jg+NdVLXuB63BZD8q37QX1GYS4swH86364vcF4sV+0QtV9k0tkspYFdn7O8bN26sgSi1/8aC6jtt/enkRI/og96a2jaEUQ58q1qx87YviCgZdpMbUDwdFyQvOgqFEp41Xt7Ca9eurb98+fLrcYy8riTw37Ztm0muZ0/bplGGzIPHIPc80gaMxx2gV+Gi52Zo/w3Id31Fhtvuy2bcjTfeuEhi+HGhwoUaHrJxqpHzWgYRPBJe2QkLhd4LFy5shkybN8HY1MEKsi7SCWTqCjXJQeJJAroEPrHcJq6xYQG1DUr6IQfTI0hxXBkvxMZwnd2IZ60Knrk66bKTihGXnP3i/pJTrmC+FKeCP8/JyTk9ZswY120LWIE8P74HkQTcR1ZPAiRAArmHABZj12IfQm52yqoVO99UuWcOs6ckQAIJBPD1UhVfdqrUvXLxi8mtXkHCpmEPkj7rJgESCIwAAiHyr1y5Uh3JVbFixb0IB3YUm5/pTtKwZ5o46yMBEggFAezF1MZNTK21jcGp2H+Z3oes1e21XGCbp153hPpIgARIQEsAN22VQoTS37F5XEFbBqm492LD2I9Ncm0TKEcCJEACJJCMgNyT6iS2f968ebeQKAmQAAmQQEgIICw5r1yZiJQU/RG2+QWaZRsFEy8jJ+YR835pSLrDZpAACZBANAjgkFcxSfVhanQzIS+pIHDALDL3GXPzNBpznq0kgdxCwJcDd27h3XrrrXOweXrarZ5MladhzxRp1kMCJGBHQIx66DYn4Y9/GxfQLLRrfJj+TsMeptFgW0iABEzSGvtOC6dST8qNTkir4PqSd98bG1cBDXsmabMuEiCBSBGAUX8Rbhjx+/NHAiRAAiRgSgCbp0WweTob5YwiVvySh0Gfv3///rKm/QiDPFfsYRgFtoEESCBUBHCpx6rRo0c/UKFChQOhapiyMTTsSlAUIwESyB0EsFJfgBubOuFKTLlMhz8SIAESIAGnBCxXzBy/XCt2euV6R7ndDTeIFXXaB5YjARIgARKIIxDUAaXYbVByMjVbBoRJwLJlJNkPEsgOAr6HO9apU2cj0grsbtiw4bImTZosvPrqqzciudepLLgNKjtmAHtBAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiSQnsD/AcvHe+V7Qv2GAAAAAElFTkSuQmCC'
                // const formdata = new FormData()
                // const defaultthumb = base64toFile(dataurl, 'thumbnail')
                // console.log(defaultthumb)
                // formdata.append('defaultthumb', defaultthumb)
                // axios.post(`${process.env.REACT_APP_SERVER_URI}/api/users/1234`, formdata)
                //     .catch(e => console.log(e))
                if (location.state.thumbnail !== 'https://velog.velcdn.com/images/after7203/post/10dffdfa-ff34-448b-906e-a341e560d1b6/image.png') {
                    const data = await fetch(`${location.state.thumbnail}`)
                    const blob = await data.blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        setThumbPreview(reader.result)
                    }
                }
            })()
            ref_editor.current.getInstance().setHTML(location.state.contents)
            setInput({ ...location.state })
        }
        document.getElementsByTagName('title')[0].innerText = '새 글 작성'
        document.getElementsByClassName("tag_form")[0].addEventListener("blur", () => setIsFocus(false))
        document.getElementsByTagName("body")[0].classList.add("scroll_off")
        window.addEventListener("mousedown", handleClickOutside);
        return (() => {
            document.getElementsByTagName("body")[0].classList.remove("scroll_off")
            window.removeEventListener("mousedown", handleClickOutside);
        })
    }, []);

    useEffect(() => {
        if (user) {
            axios.defaults.headers.common['Authorization'] = user.token;
            axios.defaults.headers.common['mongoose_id'] = user._id;
            (async () => {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/series`, { params: { id: user.id } })
                setUserSeries(res.data.userSeries)
            })()
        }
    }, [user])

    const base64toFile = (base_data, filename) => {
        var arr = base_data.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime });
    }

    const handleClickOutside = ({ target }) => {
        if (!ref_series_add.current?.contains(target)) {
            shrinkSeriesAddForm()
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const curtag = tagRef.current.value
            if (curtag !== "") {
                tagRef.current.value = ""
                if (!input.tags.find((tag) => (tag === curtag))) {
                    setInput({ ...input, tags: [...input.tags, curtag] })
                }
            }
        }
    }

    const deleteTag = (e) => {
        setInput({ ...input, tags: input.tags.filter((tag) => tag != e.target.innerText) })
    }

    const setPublic = () => {
        setInput({ ...input, scope: "public" })
        document.getElementsByClassName("public")[0].className = "public select"
        document.getElementsByClassName("private")[0].className = "private unselect"
    }

    const setPrivate = () => {
        setInput({ ...input, scope: "private" })
        document.getElementsByClassName("public")[0].className = "public unselect"
        document.getElementsByClassName("private")[0].className = "private select"
    }

    const setDetailModal = () => {
        if (input.title === '') {
            toast_null_title()
        }
        else if (ref_editor.current.getInstance().getMarkdown().length === 0) {
            toast_null_contents()
        }
        else {
            document.getElementsByClassName("detail_modal")[0].className = "detail_modal on"
            const brief = isCustomBrief || location.state ? input.brief : document.getElementsByClassName('ProseMirror toastui-editor-contents')[0].innerText.split('\n').filter(e => e !== "")[0] || ''
            const url = isCustomURL || location.state ? input.url : input.title
            if (!isCustomThumb && !location.state) {
                const contents = ref_editor.current.getInstance().getHTML()
                let result = null
                const tagindex = contents.indexOf('<img')
                if (tagindex !== -1) {
                    const start = contents.indexOf('data:', tagindex)
                    const end = contents.indexOf('"', start)
                    result = contents.substring(start, end - 1)
                }
                setThumbPreview(result)
            }
            document.getElementsByClassName('brief')[0].value = brief
            setInput({ ...input, brief: brief, url: url })
        }
    }

    const closeDetailModal = () => {
        document.getElementsByClassName("detail_modal")[0].className = "detail_modal"
    }

    const handleThumbnail = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function () {
            setThumbPreview(reader.result)
            setIsCustomThumb(true)
        }
    }

    const handleBriefChange = (e) => {
        setIsCustomBrief(true)
        if (e.target.value.length >= 150) {
            document.getElementsByClassName('count')[0].classList.add("full")
            if (e.target.value.length > 150) {
                e.target.value = e.target.value.substr(0, 147) + "...";
            }
            else {
                e.target.value = e.target.value.substr(0, 150);
            }
        }
        else {
            document.getElementsByClassName('count')[0].classList.remove("full")
        }
        setInput({ ...input, brief: e.target.value })
    }

    const expandSeriesAddForm = () => {
        ref_series_add.current?.classList.add('expand')
        ref_series_add.current?.classList.remove('shrink')
    }

    const shrinkSeriesAddForm = () => {
        if (ref_series_add.current?.className.includes('expand')) {
            ref_series_add.current?.classList.remove('expand')
            ref_series_add.current?.classList.add('shrink')
        }
    }

    const addSeries = async () => {
        const name = document.getElementsByClassName('series_add_form')[0].value
        const user_url = document.getElementsByClassName('user_url')[0].value
        for (const index in userSeries) {
            if (userSeries[index].name === name) {
                toast_duplicate_name()
                return
            }
            if (userSeries[index].url === user_url) {
                toast_duplicate_url()
                return
            }
        }
        document.getElementsByClassName("series_add_form")[0].value = ''
        document.getElementsByClassName("user_url")[0].value = ''
        shrinkSeriesAddForm()
        setIsLoading(true)
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URI}/api/users/series`, { user: user.id, name: name, url: user_url })
        setIsLoading(false)
        setUserSeries([...userSeries, { name: name, url: user_url, _id: res.data.series._id }])
    }

    const toggleSeriesSelect = (e) => {
        if ('select' === e.target.classList[0]) {
            e.target.classList.remove('select')
        }
        else {
            e.target.classList.add('select')
        }
    }

    const confirmURLSelect = () => {
        const series = Array.from(document.getElementsByClassName('series_list')[0].children).map(div => {
            if (div.className === 'select') {
                return JSON.parse(div.id)
            }
        }).filter((e) => e !== undefined)
        setInput({ ...input, series: series })
        setHandleSeries(false)
    }

    const onSubmit = async () => {
        // const { contents, files } = (() => {
        //     const contents = ref_editor.current.getInstance().getHTML()
        //     let replaced = ""
        //     const files = []
        //     let curindex = 0
        //     while (true) {
        //         const imgindex = contents.indexOf('<img', curindex)
        //         if (imgindex === -1) {
        //             replaced += contents.substring(curindex)
        //             break
        //         }
        //         const start = contents.indexOf('src="data:', imgindex) + 5
        //         const end = contents.indexOf('"', start)
        //         const file = base64toFile(contents.substring(start, end), curindex)
        //         files.push(file)
        //         replaced += contents.substring(curindex, start) + `${process.env.REACT_APP_SERVER_URI}/public/users/${user}/board/${input.url}/contents/${file.name}`
        //         curindex = end
        //     }
        //     return { contents: replaced, files }
        // })()
        let after_series = Array.from(input.series.map(series => series._id))
        let before_series = Array.from(init_series.map(series => series._id))
        const added_series = after_series.filter(_id => !before_series.includes(_id))
        const deleted_series = before_series.filter(_id => !after_series.includes(_id))
        let data = { ...input, writer: user.id, _id: location.state?._id, added_series, deleted_series }
        delete data.contents
        const formdata = new FormData()
        formdata.append('files', new File([ref_editor.current.getInstance().getHTML()], 'contents.txt', { type: "text/plain" }))
        if (thumbPreview) {
            const thumbnail = base64toFile(thumbPreview, "thumbnail")
            formdata.append('files', thumbnail)
            data.thumbnail = `public/users/${user.id}/board/${input.url}/contents/${thumbnail.name}`
        }
        else {
            data.thumbnail = 'https://velog.velcdn.com/images/after7203/post/10dffdfa-ff34-448b-906e-a341e560d1b6/image.png'
        }
        const headers = { headers: { data: encodeURIComponent(JSON.stringify(data)) } }
        setIsLoading(true)
        if (!location.state) {
            axios.post(`${process.env.REACT_APP_SERVER_URI}/api/board/${user.id}/${input.url}`, formdata, headers)
                .catch(e => console.log(e))
                .then(() => { setIsLoading(false); navigate('/') })
        }
        else {
            axios.put(`${process.env.REACT_APP_SERVER_URI}/api/board/${location.state._id}`, formdata, headers)
                .catch(e => console.log(e))
                .then(() => { setIsLoading(false); navigate('/') })
        }
    }

    return (
        <div className="write_page">
            <ToastContainer />
            <div className="form_wrap">
                <form className="write_form">
                    <input className="title" type="text" placeholder="제목을 입력하세요" defaultValue={input.title} onChange={(e) => { setInput({ ...input, title: e.target.value }) }} />
                    <div className="division" />
                    <div className="tag_wrapper">
                        {input.tags.map((tag) => (<div className='tag' key={tag} onClick={deleteTag}>{tag}</div>))}
                        <input className='tag_form' ref={tagRef} onFocus={() => { setIsFocus(true) }} placeholder="태그를 입력하세요" onKeyPress={handleEnter} />
                    </div>
                    <div className={isFocus ? "tip_wrapper focus" : "tip_wrapper"}>
                        <div className='tip'>쉼표 혹은 엔터를 입력하여 태그를 등록 할 수 있습니다. 등록된 태그를 클릭하면 삭제됩니다.</div>
                    </div>
                    <div className="editor_wrapper">
                        <Editor
                            ref={ref_editor}
                            initialValue={location.state ? location.state.contents : ''}
                            height="100%"
                            previewStyle="vertical"
                            initialEditType='wysiwyg'//'markdown'
                            placeholder="당신의 이야기를 적어보세요...."
                            hideModeSwitch={true}
                            plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
                            language="ko-KR"
                        />
                    </div>
                    <div className="below_bar">
                        <div className="exit" onClick={() => navigate(-1)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                            <h3 >나가기</h3>
                        </div>
                        <div>
                            {/* <div className="tmp_save">임시저장</div> */}
                            <div className="post" onClick={setDetailModal}>{!location.state ? '출간하기' : '수정하기'}</div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="detail_modal">
                <div className="detail_wrapper">
                    <div className="left">
                        <h2>포스트 미리보기</h2>
                        {thumbPreview &&
                            <div className="thumb_edit_btn_wrapper">
                                <h3 onClick={() => { document.getElementById('thumb_btn').click() }}>재업로드</h3>
                                <h3 onClick={() => { setThumbPreview(null); document.getElementById('thumb_btn').value = null }}>제거</h3>
                            </div>
                        }
                        <div className="thumbnail">
                            <svg width="107" height="85" fill="none" viewBox="0 0 107 85"><path fill="#868E96" d="M105.155 0H1.845A1.844 1.844 0 0 0 0 1.845v81.172c0 1.02.826 1.845 1.845 1.845h103.31A1.844 1.844 0 0 0 107 83.017V1.845C107 .825 106.174 0 105.155 0zm-1.845 81.172H3.69V3.69h99.62v77.482z"></path><path fill="#868E96" d="M29.517 40.84c5.666 0 10.274-4.608 10.274-10.271 0-5.668-4.608-10.276-10.274-10.276-5.665 0-10.274 4.608-10.274 10.274 0 5.665 4.609 10.274 10.274 10.274zm0-16.857a6.593 6.593 0 0 1 6.584 6.584 6.593 6.593 0 0 1-6.584 6.584 6.591 6.591 0 0 1-6.584-6.582c0-3.629 2.954-6.586 6.584-6.586zM12.914 73.793a1.84 1.84 0 0 0 1.217-.46l30.095-26.495 19.005 19.004a1.843 1.843 0 0 0 2.609 0 1.843 1.843 0 0 0 0-2.609l-8.868-8.868 16.937-18.548 20.775 19.044a1.846 1.846 0 0 0 2.492-2.72L75.038 31.846a1.902 1.902 0 0 0-1.328-.483c-.489.022-.95.238-1.28.6L54.36 51.752l-8.75-8.75a1.847 1.847 0 0 0-2.523-.081l-31.394 27.64a1.845 1.845 0 0 0 1.22 3.231z"></path></svg>
                            <label htmlFor="thumb_btn">썸네일 업로드</label>
                            <input className="thumb_btn" id="thumb_btn" type="file" accept="image/*" onChange={handleThumbnail} />
                            {thumbPreview &&
                                <>
                                    <div />
                                    <img src={thumbPreview} />
                                </>
                            }
                        </div>
                        <h2>{input.title}</h2>
                        <textarea className="brief" onChange={handleBriefChange} placeholder='당신의 포스트를 짧게 소개해보세요.' />
                        <div className="count"><div>{input.brief.length}/150</div></div>
                    </div>
                    <div className="right">
                        {!handleSeries &&
                            <>
                                <h2>공개 설정</h2>
                                <div className="btn_wrapper_1">
                                    <div className={`public ${input.scope === 'public' ? 'select' : 'unselect'}`} onClick={setPublic}>
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.243 22.212a10.209 10.209 0 0 1-6.03-2.939A10.218 10.218 0 0 1 1.714 12c0-2.473.868-4.813 2.458-6.673.041.492.142 1.019.116 1.395-.094 1.373-.23 2.232.574 3.39.313.451.39 1.098.542 1.62.149.51.744.779 1.155 1.094.828.635 1.62 1.373 2.5 1.932.579.369.941.552.771 1.26-.136.569-.174.92-.469 1.426-.09.155.34 1.15.482 1.292.433.433.862.83 1.333 1.219.732.604-.07 1.389-.42 2.257zm8.516-2.939a10.213 10.213 0 0 1-5.34 2.832c.285-.705.793-1.331 1.264-1.694.409-.316.922-.924 1.136-1.405.213-.48.496-.898.783-1.34.407-.628-1.005-1.577-1.463-1.776-1.03-.447-1.805-1.05-2.72-1.694-.653-.46-1.977.24-2.713-.082-1.009-.44-1.84-1.206-2.716-1.866-.905-.68-.861-1.475-.861-2.48.708.026 1.716-.196 2.187.373.148.18.659.984 1 .698.28-.233-.207-1.168-.3-1.388-.29-.676.658-.94 1.142-1.398.632-.597 1.989-1.535 1.882-1.964-.108-.428-1.358-1.643-2.092-1.453-.11.028-1.078 1.044-1.266 1.203l.015-.994c.004-.21-.39-.424-.372-.56.046-.34.996-.96 1.232-1.232-.165-.103-.73-.588-.9-.517-.415.173-.882.291-1.296.464 0-.144-.017-.279-.038-.412a10.188 10.188 0 0 1 2.614-.758l.812.326.574.68.573.591.5.162.795-.75-.205-.535v-.481c1.572.228 3.057.814 4.357 1.719-.233.02-.488.055-.777.091-.119-.07-.272-.102-.401-.15.376.81.77 1.608 1.169 2.408.426.853 1.372 1.77 1.539 2.67.195 1.063.06 2.028.166 3.278.104 1.204 1.358 2.572 1.358 2.572s.579.197 1.06.128a10.222 10.222 0 0 1-2.698 4.734z"></path></svg>
                                        <h3>전체 공개</h3>
                                    </div>
                                    <div className={`private ${input.scope === 'private' ? 'select' : 'unselect'}`} onClick={setPrivate}>
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.625 9H16.5V6.81c0-2.47-1.969-4.522-4.44-4.56a4.514 4.514 0 0 0-4.56 4.5V9H6.375A1.88 1.88 0 0 0 4.5 10.875v9a1.88 1.88 0 0 0 1.875 1.875h11.25a1.88 1.88 0 0 0 1.875-1.875v-9A1.88 1.88 0 0 0 17.625 9zm-4.969 5.85v3.225a.672.672 0 0 1-.623.675.657.657 0 0 1-.69-.656V14.85a1.5 1.5 0 0 1-.838-1.486 1.5 1.5 0 1 1 2.152 1.486zM15.187 9H8.814V6.75c0-.848.332-1.645.937-2.25A3.16 3.16 0 0 1 12 3.562a3.16 3.16 0 0 1 2.25.938 3.16 3.16 0 0 1 .938 2.25V9z"></path></svg>
                                        <h3>비공개</h3>
                                    </div>
                                </div>
                                <h2>URL 설정</h2>
                                <div className="URL">
                                    <div>/@after7203/</div>
                                    <input onChange={(e) => { setIsCustomURL(true); setInput({ ...input, url: e.target.value }) }} value={input.url} />
                                </div>
                                {input.series.length >= 1 ? <h2>선택한 시리즈</h2> : <h2>시리즈 설정</h2>}
                                <div className="below_series_label">
                                    <div className="btn_series_expand" onClick={() => setHandleSeries(true)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M14 10H2V12H14V10ZM14 6H2V8H14V6ZM18 14V10H16V14H12V16H16V20H18V16H22V14H18ZM2 16H10V14H2V16Z" fill="currentColor"></path></svg>
                                        <h3>시리즈에 추가하기</h3>
                                    </div>
                                    {
                                        input.series.length >= 1 &&
                                        <>
                                            <div className="edit_series">
                                                <div onClick={() => setHandleSeries(true)}>수정하기</div>
                                            </div>
                                            <div className="loaded_series">
                                                {input.series.map((series) => <div key={series._id}>{series.name}</div>)}
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="btn_wrapper_2">
                                    <div className="cancel" onClick={closeDetailModal}>뒤로</div>
                                    <div className="upload" onClick={onSubmit}>{!location.state ? '출간하기' : '수정하기'}</div>
                                </div>
                            </>
                        }
                        {handleSeries &&
                            <div className="series_form">
                                <h2>시리즈 설정</h2>
                                <div className="series_add" ref={ref_series_add}>
                                    <input className="series_add_form" onKeyPress={(e) => { e.key === 'Enter' && addSeries() }} placeholder="새로운 시리즈 이름을 입력하세요" onFocus={expandSeriesAddForm} onChange={(e) => !isCustomSeriesURL && (series_url_preview.current.value = e.target.value)} />
                                    <div className="url_preview">
                                        <div className="fix_url">{`/@${user.id}/series/`}</div>
                                        <input className="user_url" onKeyPress={(e) => { e.key === 'Enter' && addSeries() }} onChange={() => setIsCustomSeriesURL(true)} ref={series_url_preview} />
                                    </div>
                                    <div className="add_series_btn_wrapper">
                                        <div className="cancel_add_series_btn" onClick={shrinkSeriesAddForm}>취소</div>
                                        <div className="add_series_btn" onClick={addSeries}>시리즈 추가</div>
                                    </div>
                                </div>
                                <div className="series_list">
                                    {userSeries.map(userSeries => (
                                        <div id={JSON.stringify(userSeries)} key={userSeries._id} className={Array.from(input.series.map(series => series.name)).includes(userSeries.name) ? 'select' : ''} onClick={toggleSeriesSelect}>{userSeries.name}</div>
                                    ))}
                                </div>
                                <div className="series_btn_wrapper">
                                    <div className="cancel_series_btn" onClick={() => { setHandleSeries(false) }}>취소</div>
                                    <div className="series_btn" onClick={() => { confirmURLSelect() }}>선택하기</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Write