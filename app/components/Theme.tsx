"use client";
import React, { useState } from "react";
import { ColorPicker } from "antd";
import { Label } from "@/components/ui/label";
const Theme = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#F5F5DC");
  const [buttonColor, setButtonColor] = useState("#16a085");

  return (
    <div className="flex flex-row justify-between flex-wrap">
      <div className="flex flex-row items-center gap-x-5">
        <input type="hidden" name="textcolor" value={textColor || ""} />
        <Label>Choose Text Color</Label>
        <ColorPicker
          defaultValue={textColor}
          onChange={(color, hex) => setTextColor(hex)}
        />
      </div>
      <div className="flex flex-row items-center gap-x-5">
        <input
          type="hidden"
          name="backgroundcolor"
          value={backgroundColor || ""}
          />
          <Label>Choose Background Color</Label>

        <ColorPicker
          defaultValue={backgroundColor}
          onChange={(color, hex) => setBackgroundColor(hex)}
        />
      </div>
      <div className="flex flex-row items-center gap-x-5 ">
        <input type="hidden" name="buttoncolor" value={buttonColor || ""} />
        <Label>Choose Button Color</Label>
        <ColorPicker
          defaultValue={buttonColor}
          onChange={(color, hex) => setButtonColor(hex)}
        />
      </div>
    </div>
  );
};

export default Theme;
