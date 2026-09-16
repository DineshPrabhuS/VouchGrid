package com.vouchgrid.backend.vouches.service;

import java.util.List;
import java.util.UUID;

import com.vouchgrid.backend.vouches.dto.CreateVouchRequest;
import com.vouchgrid.backend.vouches.dto.VouchResponse;

public interface VouchService {

    VouchResponse createVouch(
            CreateVouchRequest request,
            UUID authorUserId
    );

    List<VouchResponse> getProjectVouches(
            UUID projectId
    );

    List<VouchResponse> getUserVouches(
            UUID userId
    );
}