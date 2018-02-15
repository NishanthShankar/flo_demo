package com.flodemo;

import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    
    // @Override
    // protected void onCreate(Bundle savedInstanceState) {
    //     super.onCreate(savedInstanceState);
    //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    //         Window w = getWindow(); // in Activity's onCreate() for instance
    //         w.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
    //     }
    // }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "floDemo";
    }
}
