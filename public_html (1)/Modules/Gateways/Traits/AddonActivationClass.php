<?php

namespace Modules\Gateways\Traits;

trait AddonActivationClass
{
    public function isActive(): array
    {
        foreach (SOFTWARE_INFO as $soft_info) {
            if ($soft_info['software_id'] == base64_decode(env('SOFTWARE_ID'))) {
                $route = route($soft_info['values']['addon_index_route']);
            }
        }
        return [
            'active' => 1,
            'route' => $route ?? null
        ];
    }

    public function is_local(): bool
    {
        $whitelist = array(
            '127.0.0.1',
            '::1'
        );

        if (!in_array(request()->ip(), $whitelist)) {
            return false;
        }

        return true;
    }
}
