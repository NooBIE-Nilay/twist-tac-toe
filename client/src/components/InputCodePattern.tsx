import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "./ui/input-otp"

export function InputCodePattern({
    setCode,
    value = "",
}: {
    setCode: (code: string) => void
    value: string
}) {
    return (
        <InputOTP
            value={value}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onChange={(value) => setCode(value)}
        >
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>
    )
}
